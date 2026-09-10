# Ekstübasyon sonucu — makine öğrenmesi kıyaslaması

Veri: 60 hasta, 23 weaning başarısızlığı, 46 ekstübasyon öncesi değişken (olay/değişken = 0,50).
Sonuç sonrası değişkenler (`SONRAKI DESTEK`, `EKSTUBASYON BASARISIZLIK ZAMANI`) sızıntı olarak dışlandı.
Ön işleme her katta ayrı; hiperparametre seçimi iç döngüde (iç içe CV, 10 kat × 10 tekrar).

| Model | Görünen EAA | İç içe CV EAA | %10-90 bant | İyimserlik |
|---|---|---|---|---|
| Logistic L2 (46 özellik) | 0,953 | 0,553 | 0,25–0,89 | **+0,400** |
| LASSO L1 (46 özellik) | 0,908 | 0,592 | 0,25–0,88 | +0,316 |
| Random forest | 0,989 | 0,599 | 0,25–1,00 | +0,390 |
| Gradient boosting | 0,958 | 0,565 | 0,25–0,88 | +0,393 |
| **Lojistik P0.1 + NIF (makale)** | **0,821** | **0,827** | 0,50–1,00 | **−0,006** |
| MP/NIF indeksi tek başına | 0,740 | 0,740 | — | 0 |

**Permütasyon kontrolü** (hedef karıştırıldı, random forest): CV EAA = **0,552 ± 0,142**.

## Yorum

1. Dört ML modelinin çapraz doğrulanmış performansı (0,553–0,599) **permütasyon tabanından
   (0,552) ayırt edilemez**. Yani gerçek etiketlerle karıştırılmış etiketler arasında fark yok:
   modeller genellenebilir hiçbir şey öğrenmemiş.
2. Makalenin iki değişkenli modelinde **iyimserlik sıfır** (0,821 → 0,827). Doğru boyutlanmış
   bir modelin imzası budur.
3. Örneklem dışı performansta iki değişken, 46 değişkenli en iyi ML modelini **0,23 EAA**
   farkla geçiyor.
4. ML modellerinin %10-90 bantları 0,25–1,00 arasında: bireysel katlar tesadüften kötü ile
   kusursuz arasında savruluyor. Gürültü örüntüsü.

## Kısıtlılık (kendi analizimizin)

İki değişkenli modelin 0,827'si de tam temiz bir örneklem dışı tahmin değildir: katsayılar her
katta yeniden kestiriliyor, ancak **hangi iki değişkenin kullanılacağı** 60 hastanın tamamına
bakılarak seçilmişti. Değişken seçimi CV döngüsünün dışında kaldığı için bu değer bir miktar
iyimserdir. Makaledeki bootstrap düzeltmesi (0,821 → 0,808) de seçim iyimserliğini yakalamaz.
Bu, ML modellerinin durumundan çok daha hafif bir sorundur, ancak sıfır değildir.
