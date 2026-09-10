"""LASSO hangi değişkenleri seçiyor ve bu seçim kararlı mı?
Bootstrap ile seçim kararlılığı (stability selection) + RF permütasyon önemi."""
import numpy as np, warnings
from sklearn.pipeline import Pipeline
from sklearn.impute import SimpleImputer
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import LogisticRegressionCV
from sklearn.ensemble import RandomForestClassifier
from sklearn.inspection import permutation_importance
from sklearn.model_selection import RepeatedStratifiedKFold
from build_features import load
warnings.filterwarnings("ignore")
X,y,_=load(); Xv=X.values; names=list(X.columns); n=len(y)

# 1) stability selection: 500 bootstrap, her birinde LASSO
rng=np.random.default_rng(0); sel=np.zeros(len(names))
B=500; ok=0
for _ in range(B):
    i=rng.integers(0,n,n)
    if len(np.unique(y[i]))<2: continue
    pl=Pipeline([("imp",SimpleImputer(strategy="median")),("sc",StandardScaler()),
                 ("clf",LogisticRegressionCV(Cs=6,penalty="l1",solver="liblinear",
                        cv=3,scoring="roc_auc",max_iter=4000,random_state=0))]).fit(Xv[i],y[i])
    c=pl.named_steps["clf"].coef_[0]; sel+=(np.abs(c)>1e-8); ok+=1
freq=sel/ok
print("LASSO SEÇİM KARARLILIĞI ({} bootstrap) — sıfır olmayan katsayı yüzdesi".format(ok))
for j in np.argsort(-freq)[:14]:
    print("   {:<14}{:>6.0%}".format(names[j], freq[j]))
print("   ... hiç seçilmeyen: {} / {} değişken".format(int((freq==0).sum()), len(names)))

# 2) RF permütasyon önemi (tüm veride, yalnızca tanımlayıcı)
rf=Pipeline([("imp",SimpleImputer(strategy="median")),
             ("clf",RandomForestClassifier(n_estimators=500,min_samples_leaf=3,random_state=0))]).fit(Xv,y)
pi=permutation_importance(rf,Xv,y,scoring="roc_auc",n_repeats=30,random_state=0)
print("\nRANDOM FOREST PERMÜTASYON ÖNEMİ (ilk 10)")
for j in np.argsort(-pi.importances_mean)[:10]:
    print("   {:<14}{:+.4f}".format(names[j], pi.importances_mean[j]))
