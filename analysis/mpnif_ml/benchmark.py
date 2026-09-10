"""Görünen (in-sample) vs iç içe çapraz doğrulanmış performans.
Ön işleme (impute/scale) her katta ayrı yapılır; hiperparametre seçimi iç döngüde.
"""
import numpy as np, warnings, json, sys
from sklearn.pipeline import Pipeline
from sklearn.impute import SimpleImputer
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import LogisticRegression
from sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier
from sklearn.model_selection import RepeatedStratifiedKFold, GridSearchCV, cross_val_predict
from sklearn.metrics import roc_auc_score
from build_features import load
warnings.filterwarnings("ignore")

X, y, _ = load()
Xv = X.values
N_REPEAT = int(sys.argv[1]) if len(sys.argv) > 1 else 20
outer = RepeatedStratifiedKFold(n_splits=10, n_repeats=N_REPEAT, random_state=7)
inner = RepeatedStratifiedKFold(n_splits=5, n_repeats=1, random_state=11)

def pipe(clf, scale=True):
    steps = [("imp", SimpleImputer(strategy="median"))]
    if scale: steps.append(("sc", StandardScaler()))
    steps.append(("clf", clf))
    return Pipeline(steps)

MODELS = {
 "Logistic L2 (46 özellik)": (pipe(LogisticRegression(max_iter=5000)),
                              {"clf__C":[0.01,0.03,0.1,0.3,1,3]}),
 "LASSO L1 (46 özellik)":    (pipe(LogisticRegression(penalty="l1",solver="liblinear",max_iter=5000)),
                              {"clf__C":[0.01,0.03,0.1,0.3,1,3]}),
 "Random forest":            (pipe(RandomForestClassifier(random_state=0,n_jobs=1), scale=False),
                              {"clf__n_estimators":[300],"clf__max_depth":[2,3,None],
                               "clf__min_samples_leaf":[1,3,5]}),
 "Gradient boosting":        (pipe(GradientBoostingClassifier(random_state=0), scale=False),
                              {"clf__n_estimators":[100],"clf__max_depth":[1,2],
                               "clf__learning_rate":[0.03,0.1]}),
}

def nested_auc(est, grid, Xm):
    """Dış katlarda tahmin topla -> tek bir dürüst EAA."""
    gs = GridSearchCV(est, grid, scoring="roc_auc", cv=inner, n_jobs=-1, refit=True)
    aucs=[]
    for tr, te in outer.split(Xm, y):
        gs.fit(Xm[tr], y[tr])
        p = gs.predict_proba(Xm[te])[:,1]
        if len(np.unique(y[te]))>1: aucs.append(roc_auc_score(y[te], p))
    return np.mean(aucs), np.percentile(aucs,[10,90])

rows=[]
for name,(est,grid) in MODELS.items():
    gs = GridSearchCV(est, grid, scoring="roc_auc", cv=inner, n_jobs=-1, refit=True).fit(Xv,y)
    app = roc_auc_score(y, gs.predict_proba(Xv)[:,1])          # görünen
    cv, band = nested_auc(est, grid, Xv)                        # dürüst
    rows.append((name, app, cv, band, app-cv))
    print("{:<26} görünen {:.3f} | CV {:.3f} [{:.2f}-{:.2f}] | iyimserlik {:+.3f}".format(name,app,cv,band[0],band[1],app-cv))

# --- referanslar: makalenin modeli ve indeksin kendisi ---
i_p01, i_nif, i_mpnif = X.columns.get_loc("p01"), X.columns.get_loc("nif"), X.columns.get_loc("mp_nif")
X2 = Xv[:, [i_p01, i_nif]]
est2 = pipe(LogisticRegression(max_iter=5000))
gs2 = GridSearchCV(est2, {"clf__C":[1e6]}, scoring="roc_auc", cv=inner, n_jobs=-1).fit(X2,y)
app2 = roc_auc_score(y, gs2.predict_proba(X2)[:,1]); cv2,b2 = nested_auc(est2, {"clf__C":[1e6]}, X2)
print("{:<26} görünen {:.3f} | CV {:.3f} [{:.2f}-{:.2f}] | iyimserlik {:+.3f}".format("Lojistik P0.1+NIF (makale)",app2,cv2,b2[0],b2[1],app2-cv2))
rows.append(("Lojistik P0.1+NIF (makale)",app2,cv2,b2,app2-cv2))

auc_idx = roc_auc_score(y, -np.nan_to_num(Xv[:,i_mpnif], nan=np.nanmedian(Xv[:,i_mpnif])))
print("{:<26} görünen {:.3f} | CV {:.3f} (aynı: uydurulan katsayı yok)".format("MP/NIF indeksi tek başına",auc_idx,auc_idx))
rows.append(("MP/NIF indeksi tek başına",auc_idx,auc_idx,(auc_idx,auc_idx),0.0))

# --- permütasyon kontrolü: hat sızıntısızsa CV ~0.50 olmalı ---
rng=np.random.default_rng(3); perm=[]
est,grid = MODELS["Random forest"]
o2 = RepeatedStratifiedKFold(n_splits=10, n_repeats=3, random_state=5)
for _ in range(5):
    ysh = rng.permutation(y); a=[]
    gs = GridSearchCV(est, grid, scoring="roc_auc", cv=inner, n_jobs=-1)
    for tr,te in o2.split(Xv,ysh):
        gs.fit(Xv[tr], ysh[tr])
        if len(np.unique(ysh[te]))>1: a.append(roc_auc_score(ysh[te], gs.predict_proba(Xv[te])[:,1]))
    perm.append(np.mean(a))
print("\npermütasyon kontrolü (hedef karıştırılmış, RF): CV EAA = {:.3f} ± {:.3f}  (beklenen ~0.50)".format(np.mean(perm),np.std(perm)))
json.dump([{"model":r[0],"apparent":r[1],"cv":r[2],"optimism":r[4]} for r in rows], open("benchmark_results.json","w"), indent=1)
