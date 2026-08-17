# Aday Açık Erişimli Kaynaklar (USG Görselleri)

PubMed üzerinden taranarak derlenmiş, **açık erişimli (PMC'de tam metni olan)**
ve sonoanatomi figürü içeren makale listesi. Amaç: hangi PDF'i açıp hangi
figürü alacağınızı önceden bilmeniz.

> **Bu dosyadaki görseller uygulamaya eklenmedi.** Bu geliştirme ortamının ağ
> politikası PMC, yayıncı siteleri ve tüm görsel barındırma servislerini
> engellediği için figürler indirilemedi. Makaleleri siz açıp figürü
> indirdiğinizde `README.md`'deki üç adımla eklenir.

## ⚠ Lisansı mutlaka kendiniz doğrulayın

Aşağıdaki makalelerin **açık erişimli olduğu doğrulandı**, ancak her birinin
tam lisans metni tek tek doğrulanamadı (PubMed'in telif sorgulama aracı bu
oturumda kullanılamadı). Figürü almadan önce makalenin kendi sayfasındaki
lisans satırına bakın:

- **CC BY 4.0** → atıf vererek serbestçe kullanılır. *Cureus'un tamamı
  CC BY 4.0'dır*, bu yüzden listedeki Cureus makaleleri en güvenli seçenektir.
- **CC BY-NC** → ticari olmayan kullanım. Uygulama ücretsiz/eğitim amaçlı
  kaldığı sürece uygundur; ileride ücretli hale gelirse kullanılamaz.
- **CC BY-ND** veya "tüm hakları saklıdır" → **kullanmayın.**

Kaynak satırını `src/data/reference-images.ts` içine şu biçimde yazın:

```
credit: "Park D, Chang MC. J Yeungnam Med Sci. 2022;39(3):190-199, Fig. 5 (CC BY-NC 4.0)",
```

## Liste

### 1. Toraks ve göğüs duvarı — tek makalede 5 teknik

Park D, Chang MC. *Ultrasound-guided interventions for controlling the thoracic
spine and chest wall pain: a narrative review.* J Yeungnam Med Sci.
2022;39(3):190-199. PMC9273134 —
[DOI](https://doi.org/10.12701/jyms.2022.00192)

Kapsadığı anahtarlar: `usg-esp`, `usg-pecs2`, ayrıca torasik paravertebral ve
interkostal blok figürleri. **Listedeki en verimli kaynak.**

### 2. Adduktor kanal

Sonawane K, Dixit H, Mistry T, Gurumoorthi P, Balavenkatasubramanian J.
*Anatomical and Technical Considerations of the Hi-PAC (Hi-Volume Proximal
Adductor Canal) Block.* Cureus. 2022;14(2):e21953. PMC8903815 —
[DOI](https://doi.org/10.7759/cureus.21953)

Anahtar: `usg-adductor-canal`. Femoral arter, safen sinir, sartorius ve
vastoadduktor membran figürleri içerir. Cureus → CC BY 4.0.

### 3. Torasik paravertebral

Wardhan R, Kantamneni S. *The Challenges of Ultrasound-guided Thoracic
Paravertebral Blocks in Rib Fracture Patients.* Cureus. 2020;12(4):e7626.
PMC7153808 — [DOI](https://doi.org/10.7759/cureus.7626)

Torakotomi kartındaki paravertebral blok için. Cureus → CC BY 4.0.

### 4. İnterskalen / üst trunkus

Wardhan R, Nimma SR. *Ultrasound-Guided Upper Trunk Perineural Catheter for
Shoulder Surgery: A Description of Catheter Technique.* Cureus.
2020;12(10):e11095. PMC7584319 — [DOI](https://doi.org/10.7759/cureus.11095)

Anahtar: `usg-interscalene`. Frenik sinirden kaçınan üst trunkus yaklaşımının
sonoanatomisi. Cureus → CC BY 4.0.

### 5. Servikal bölge

Moreno B, Barbosa J. *Ultrasound-Guided Procedures in the Cervical Spine.*
Cureus. 2021;13(12):e20361. PMC8668143 —
[DOI](https://doi.org/10.7759/cureus.20361)

Tiroidektomi kartındaki servikal pleksus bloğu için servikal sonoanatomi.
Cureus → CC BY 4.0.

### 6. Erektor spina (ek)

Pegu B, Gupta B, Ayub A. *Bilateral ultrasound-guided erector spinae plane
block for postoperative pain relief in major traumatic spine surgery.* Saudi J
Anaesth. 2024;18(3):352-359. PMC11323918 —
[DOI](https://doi.org/10.4103/sja.sja_694_23)

Anahtar: `usg-esp` (lomber omurga kartı için).

## Henüz kaynak bulunamayan anahtarlar

Bunlar için tarama sürdürülmeli:

| Anahtar | Teknik |
| --- | --- |
| `usg-tap` | Transversus abdominis düzlemi |
| `usg-peng` | PENG |
| `usg-fascia-iliaca` | Fasya iliaka |
| `usg-popliteal-sciatic` | Popliteal siyatik |
| `usg-supraclavicular` | Supraklaviküler |
| `usg-infraclavicular` | İnfraklaviküler |
| `usg-spinal` | Lomber spinal |

**Arama ipucu:** PubMed'de `<teknik adı> AND sonoanatomy` yeterince dar bir
sonuç veriyor; ardından `Cureus[journal]` ekleyerek doğrudan CC BY 4.0
makalelere inebilirsiniz. Ayrıca "Free full text" filtresi PMC'de tam metni
olanları getirir.

---

*Makale bilgileri PubMed'den alınmıştır.*
