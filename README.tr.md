# ghostless

[English](README.md) · **Türkçe**

Claude Code için (ve `SKILL.md` okuyan diğer ajanlar için) bir tasarım skill'i. Amacı, sitelerin
ve uygulama arayüzlerinin yapay zekâ yapmış gibi görünmesini engellemek.

"Diş kliniği için site yap" gibi her isteğin bir *hayaleti* var: herhangi bir modelin düşünmeden
çıkardığı tasarım. Mor gradyan, Inter, hap şeklinde rozet, ortalanmış hero, üç ikonlu kart,
"Trusted by" ve her bölümde aşağıdan süzülen animasyon. Diğer anti-slop skill'leri bu
özellikleri yasaklıyor. O zaman da varsayılan bir sonraki modaya kayıyor: krem + kiremit rengi,
siyah + fosforlu yeşil.

ghostless işe pikselden önce başlıyor:

1. **Konu dosyası:** Düzene geçmeden önce müşterinin dünyasından malzeme toplanır: nesneler,
   belgeler, malzemeler, sayılar, müşterilerin kullandığı kelimeler. Ayırt edici tasarım buradan çıkar.
2. **Hayalet geçişi:** Varsayılan tasarım bir tabloya yazılır. Her satır ya bilerek değiştirilir
   ya da dosyadaki bir gerçekle gerekçelendirilir.
3. **Kaçınmak değil, hedeflemek:** Gerçek, üst düzey sitelerden bir referans panosu kurulur, hedeflenen his belirlenir ve bir etki ölçütüyle puanlanır.
   Temiz tarama + sıkıcı sonuç = başarısız. "Steril kaçış" (tek renk tablo, belge kılığında sayfa) da bir hata türü.
4. **Enerji yelpazesinde üç yön:** cesur, rafine ve sürpriz. Her biri farklı bir adlı stilden (editoryal, İsviçre,
   risograf, dither, terminal…) yola çıkar ve kendi hareket dilini taşır: konudan gelen bir motif, tek bir imza
   hareket, yan yana iki bölümün aynı şekilde gelmemesi. Her birinin bir hero görsel planı olur. Yönler yüksek
   kaliteli önizleme olarak hazırlanır ve kişiye göstermeden önce bizzat açılıp bakılır, sonra seçim sorulmadan önce kişiye gerçekten gösterilir
   (tarayıcı sekmesi ya da sohbete ekran görüntüsü).
5. **Rollü sistem:** Token'lar ne işe yaradığını söyler. Köşe yarıçapı, gölge ve boşluk hiyerarşi seviyesine göre değişir.
6. **Önce kelimeler:** Gerçek metin yazılır ve ilk ekranda "özgüllük sayısı" aranır. Klişe sözlüğü **İngilizce ve Türkçe** olarak gelir.
7. **Ölçüm:** `slop-scan.mjs` kodu 20'den fazla işarete göre puanlar. Ardından görsel testler yapılır:
   isim değiştirme, kısık göz, bir şey silme, rakiplerle yan yana koyma.
8. **Tasarım günlüğü:** Seçilmeyen yönlerin neden beğenilmediği sorulur ve cevap kişinin kendi sözleriyle kaydedilir. Böylece bir sonraki oturum aynı şeyi tekrar önermez.

## Hareket kataloğu

`references/motion.md` yaklaşık 50 adlı hareketi (maskeli satır, piksel/mozaik çözülme, dither, halftone,
ASCII, iris, şerit birleşme, sabitlenmiş hikâye, View Transitions…) npm'de doğrulanmış kütüphaneleriyle
(GSAP ve artık ücretsiz eklentileri, Lenis, Motion, Paper Shaders, OGL, three…) listeler. Hazır bileşen
kitlerinin "yapay zekâ sitesi" imzası olan efektlerini (beam, spotlight, shimmer, aurora) tarayıcı yakalar.

## Galeri: bakarak seç

Çoğu kişi tasarım stillerinin adını bilmez, bileşen kodundan anlamaz ama görünce neyi sevdiğini bilir.
ghostless yerelde site kurucusu gibi bir seçim sayfası açar:

```bash
node ~/.claude/skills/ghostless/scripts/gallery.mjs            # 5600'den başlayarak boş bir portta açılır
```

Aynı hayali müşterinin (iskele kenarında bir kahve kavurma evi) ~80 canlı demosu: 34 görsel stil, yazı
hareketleri, görselin oluşması (piksel, dither, halftone, şerit, parçacık), kaydırma hareketleri,
etkileşim ve görsel işleme. Galeri açılmadan önce skill senin projenin ilk ekranını 8–12 farklı stilde (kendi adın, metnin ve
görsellerinle) hazırlar; galeri bunları en üstte gösterir, böylece stilleri kendi içeriğinde görürsün.
Seçimler her proje için ayrı saklanır. **Beğendim** ya da **Asla** ile işaretle, not yaz, gönder: seçim
`tasarim/secimler.json` dosyasına yazılır ve üç yön buradan kurulur. `--directions tasarim/yonler` ile
aynı sayfa üç yönün önizlemesini de gösterir; biri seçilir, diğerlerinin neden olmadığı işaretlenir.
Tüm demoların ekran görüntüleri: [`gallery/GALLERY.md`](gallery/GALLERY.md).

## Görseller

Şablon sitelerde görsel azdır. ghostless bol görselle plan yapar: önce müşterinin kendi fotoğrafları,
sonra üretilen görseller (3D, veriden üretilen grafik, illüstrasyon), sonra internetten kendisinin
bulup indirdiği açık lisanslı görseller. Yalnız ticari kullanıma ve düzenlemeye izin veren lisanslar
alınır, görseller indirilip siteden sunulur, kaynakça tutulur:

```bash
node ~/.claude/skills/ghostless/scripts/fetch-images.mjs "solder joint macro" --n 12 --orientation landscape
```

Aramalar sektör adından değil konudan gelir ("iş dünyası" değil "gece yağmurda çekici vinci"), ve her
aday kullanılmadan önce gözle kontrol edilir.

## Adım kontrolü

Yönler gösterilmeden önce `node ~/.claude/skills/ghostless/scripts/check.mjs` çalışır: konu dosyası, gerçek
sitelerden referans panosu, galeri seçimi, toplanan görseller ve üç yönün görsel + hareket içerdiği
kontrol edilir. Bir adım ancak kişi kendi sözüyle vazgeçerse atlanır.

## Kurulum

```bash
git clone https://github.com/oktayyavuz/ghostless ~/.claude/skills/ghostless
```

İş arayüz tasarımıyla ilgili olduğunda Claude skill'i kendiliğinden açar. İstersen `/ghostless` ile de çağırabilirsin.

## Tarayıcı

Bağımlılığı yok, Node 18 ve üstünde çalışır.

```bash
node ~/.claude/skills/ghostless/scripts/slop-scan.mjs src
node ~/.claude/skills/ghostless/scripts/slop-scan.mjs src --fail-under 80
```

Bir satırı susturmak için o satıra `ghostless-ignore` yorumu ekle. Bütün dosya için `ghostless-ignore-file` yaz.
Her bulgu bir karar değil, cevaplanması gereken bir sorudur.

## Lisans

MIT
