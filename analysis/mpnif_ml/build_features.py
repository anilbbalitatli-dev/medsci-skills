"""Ekstübasyon sonucu için sızıntısız özellik matrisi.
Dışlananlar: hasta kimliği, tarihler, ham tekrar ölçümler (ortalamaları var),
ve SONUÇ SONRASI değişkenler (başarısızlık zamanı, ekstübasyon sonrası destek)."""
import pandas as pd, numpy as np, re

LEAK = ["EKSTUBASYON BASARISIZLIK ZAMANI ", "SONRAKI DESTEK "]   # sonuç sonrası
DROP = ["Parameter", "ENTUBASYON GUNU (YYYY-MM-DD)", "EKSTUBASYON GUNU (YYYY-MM-DD)",
        "```", "Unnamed: 62", "Unnamed: 63", "Unnamed: 69", "Unnamed: 71",
        "Unnamed: 73", "Unnamed: 74"]
TARGET = "EKSTUBASYON BASARISI (BASARILI/BASARISIZ)"

def num(s):
    return pd.to_numeric(s.astype(str).str.replace(",", ".", regex=False)
                          .str.replace(r"[^0-9.\-]", "", regex=True), errors="coerce")

def load(path="data.xlsx"):
    df = pd.read_excel(path)
    df = df[df[TARGET].notna()].reset_index(drop=True)
    y = df[TARGET].astype(int).values

    X = pd.DataFrame(index=df.index)
    # demografi
    X["yas"] = num(df["YAS"]); X["boy"] = num(df["BOY (cm)"]); X["kilo"] = num(df["KILO (kg)"])
    X["erkek"] = (df["CINSIYET"].astype(str).str.strip().str.upper() == "E").astype(int)
    # komorbidite
    for c in ["KKY","DM","HT","KBY","ONKOLOJİK HASTALIK","ENDOKRİN HASTALIK","SVO",
              "NÖROLOJİK HASTALIK","ASTIM/KOAH","KAH"]:
        X["kom_"+re.sub(r"\W+","_",c.strip().lower())] = num(df[c])
    # entübasyon nedeni (one-hot, boşluk/yazım varyantları birleştirilir)
    nd = df["ENTUBASYON NEDENİ"].astype(str).str.strip().str.upper()
    for lev in sorted(nd.dropna().unique()):
        if lev in ("NAN",""): continue
        X["neden_"+re.sub(r"\W+","_",lev.lower())] = (nd == lev).astype(int)
    # süre + vitaller
    X["mv_gun"] = num(df["MV GÜN SAYISI"]); X["nabiz"] = num(df["NABIZ (bpm)"])
    X["spo2"] = num(df["SPO2 (%)"]); X["ates"] = num(df["ATES "])
    bp = df["KAN BASINCI (mmHg"].astype(str).str.extract(r"(\d+)\s*/\s*(\d+)")
    X["sistolik"] = pd.to_numeric(bp[0], errors="coerce")
    X["diastolik"] = pd.to_numeric(bp[1], errors="coerce")
    # ventilatör ortalamaları + türetilmiş indeksler (hepsi ekstübasyon öncesi)
    for src, name in [("RR_ort","rr"),("VT_ort","vt"),("Ppeak_ort","ppeak"),("Pplat_ort","pplat"),
                      ("PBW","pbw"),("Peep ort","peep"),("Efor ort","efor"),("mp-pbw","mp_pbw"),
                      ("P0.1 ort","p01"),("Nıf ort","nif"),("mp","mp"),("rsbi","rsbi"),
                      ("mp/nıf","mp_nif"),("dp","dp"),("APACHE","apache"),
                      ("ph","ph"),("pco2","pco2"),("hc03","hco3"),("lac","lac")]:
        X[name] = num(df[src])
    X["fio2"] = pd.concat([num(df[f"FIO2 {i}"]) for i in (1,2,3)], axis=1).mean(axis=1)
    return X, y, df

if __name__ == "__main__":
    X, y, _ = load()
    print("özellik matrisi:", X.shape, "| olay (başarısızlık):", int((y==0).sum()), "| başarı:", int((y==1).sum()))
    print("olay/değişken oranı: {:.2f}".format((y==0).sum()/X.shape[1]))
    miss = X.isna().mean().sort_values(ascending=False)
    print("eksiklik > 0:", {k: f"{v:.0%}" for k,v in miss[miss>0].items()})
    print("\nDIŞLANANLAR (sızıntı):", LEAK)
