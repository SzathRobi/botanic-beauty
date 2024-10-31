import randomImage from '../../../../public/our-works-2.png'
import { Service } from '../types/service.type'

export const SERVICES: Service[] = [
  {
    duration: 60,
    name: 'Női Hajvágás',
    shortDescription:
      'Stílusos női hajvágás, amely kiemeli egyéni szépséged és harmonizál egyéniségeddel.',
    longDescription:
      'Női hajvágásainkat a legújabb divatirányzatok inspirálják, ugyanakkor figyelembe vesszük arcformád, hajtípusod és személyes stílusod, hogy a végeredmény tökéletesen passzoljon hozzád. Akár rövidebb frizurát, akár hosszú, réteges vágást szeretnél, profi csapatunk segít elérni álmaid haját.',
    image: randomImage,
    queryParam: 'szolgaltatas=noi-hajvagas',
  },
  {
    duration: 45,
    name: 'Férfi Hajvágás',
    shortDescription:
      'Professzionális férfi hajvágás, modern vagy klasszikus stílusban, hogy a legjobb formádat hozd.',
    longDescription:
      'A férfi hajvágás nem csupán a stílusról, hanem az egyszerű kezelhetőségről és az egyéni megjelenésről is szól. Legyen szó klasszikus vagy trendi stílusról, célunk, hogy olyan frizurát kapj, amelyet könnyű fenntartani, és amely magabiztossá tesz a mindennapokban. Frissítsd megjelenésed, és élvezd a professzionális ápolást!',
    image: randomImage,
    queryParam: 'szolgaltatas=ferfi-hajvagas',
  },
  {
    duration: 150,
    name: 'Hajfestés',
    shortDescription:
      'Természetes és tartós hajszín, amely új életet visz a frizurádba, egyéniségedhez igazítva.',
    longDescription:
      'Hajfestés szolgáltatásunkkal személyre szabott, hosszan tartó és vibráló színeket érhetünk el. A legújabb technikákat alkalmazva biztosítjuk, hogy hajad egészséges maradjon, miközben tökéletesen harmonizál stílusoddal és egyéniségeddel. Bízd ránk a megjelenésed frissítését, és élvezd az új színek adta energiát.',
    image: randomImage,
    queryParam: 'szolgaltatas=hajfestes',
  },
  {
    duration: 240,
    name: 'Ombre Hajfestés',
    shortDescription:
      'Lágy színátmenet a hajvégeken, amely stílusosan és természetesen kiemeli a hajszínt.',
    longDescription:
      'Az ombre hajfestés egy igazán divatos technika, ahol a hajvégek színe fokozatosan világosodik, természetes átmenetet képezve. Ez a stílus ideális választás, ha finom változásra vágysz, ami kiegészíti természetes hajszíned, és feldobja a megjelenésed anélkül, hogy túl drámai lenne.',
    image: randomImage,
    queryParam: 'szolgaltatas=ombre-hajfestes',
  },
  {
    duration: 240,
    name: 'Balayage Hajfestés',
    shortDescription:
      'Lágy, természetes hatású hajfestés, amely gyönyörű színátmenetet biztosít.',
    longDescription:
      'A balayage egy kézzel festett technika, mely során a hajra természetes, napcsókolta hatást keltő színeket viszünk fel. Ez a színátmenet időtálló, és kiemeli a haj textúráját, így ideális választás minden hajtípusra. Könnyen karbantartható és hosszan tartó eredményt biztosít.',
    image: randomImage,
    queryParam: 'szolgaltatas=balayage-hajfestes',
  },
  {
    duration: 30,
    name: 'Hajápolás',
    shortDescription:
      'Tápláló hajápolás, amely erősíti és ragyogóvá teszi a hajat.',
    longDescription:
      'Hajápolási kezeléseink célja a haj vitalitásának visszaállítása és a sérült hajszálak regenerálása. Speciális maszkokkal és szérumokkal tápláljuk és hidratáljuk a hajszálakat, amelyek erősebbek, egészségesebbek és fényesebbek lesznek. Érezd a különbséget már az első kezelés után!',
    image: randomImage,
    queryParam: 'szolgaltatas=hajapolas',
  },
  {
    duration: 240,
    name: 'Keratinos Hajkezelés',
    shortDescription:
      'Kezelés, amely táplálja és regenerálja a hajszálakat, selymes és egészséges hatást nyújtva.',
    longDescription:
      'A keratinos hajkezelés tökéletes megoldás a száraz, töredezett haj újjáélesztésére. Ezzel a kezeléssel keratin kerül a hajszálakba, így azok erősebbek, selymesebbek és fényesebbek lesznek. Ideális választás azoknak, akik gyakran formázzák a hajukat, és szeretnék visszaállítani annak egészségét.',
    image: randomImage,
    queryParam: 'szolgaltatas=keratinos-hajkezeles',
  },
  {
    duration: 240,
    name: 'Szőkítés',
    shortDescription:
      'Professzionális szőkítés, amely világosítja és kiemeli a természetes színeket.',
    longDescription:
      'Szőkítési szolgáltatásunkkal természetes, fényes és ragyogó szőke hajat varázsolunk. Akár teljes szőkítést, akár világosítást szeretnél, tapasztalt fodrászaink biztonságosan és kíméletesen érnek el lenyűgöző eredményeket, amelyek természetesnek és egészségesnek tűnnek.',
    image: randomImage,
    queryParam: 'szolgaltatas=szokites',
  },
  {
    duration: 60,
    name: 'Hajkiegyenesítés',
    shortDescription:
      'Gyors és hatékony hajkiegyenesítés, hogy a haj sima és egyenes maradjon.',
    longDescription:
      'A hajkiegyenesítés szolgáltatásunkat azoknak ajánljuk, akik egyenes és fényes hajat szeretnének. Professzionális eszközökkel és technikákkal segítünk, hogy hajad tartósan sima és egyenes maradjon, amit könnyű kezelni és formázni.',
    image: randomImage,
    queryParam: 'szolgaltatas=hajkiegyenesites',
  },
  {
    duration: 60,
    name: 'Hajgöndörítés',
    shortDescription:
      'Tartós göndörítés a természetes, laza hullámokért és a bouncy hatásért.',
    longDescription:
      'A hajgöndörítés szolgáltatásunkkal varázslatos, tartós hullámokat vagy göndörséget adunk hajadnak, amely könnyed, természetes és látványos. Akár finom hullámokra, akár erős göndörségre vágysz, profi technikánk segít elérni a kívánt hatást, amitől hajad élettel teli lesz.',
    image: randomImage,
    queryParam: 'szolgaltatas=hajgondorites',
  },
  {
    duration: 15,
    name: 'Frufru Vágás',
    shortDescription:
      'Divatos frufru vágás, amely tökéletesen keretezi arcodat és kiemeli egyedi stílusodat.',
    longDescription:
      'A frufru remek módja annak, hogy karaktert adj frizurádnak, és kiemeld arcvonásaidat. Legyen szó klasszikus, egyenes frufruról, vagy lágyabb, oldalt elhelyezkedő stílusról, segítünk megtalálni az arcformádhoz leginkább illőt. Gyere el, és újíts be egy trendi frufruval!',
    image: randomImage,
    queryParam: 'szolgaltatas=frufru-vagas',
  },
]
