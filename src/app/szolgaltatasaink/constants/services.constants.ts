import balayageImage from '../../../../public/services/service-balayage-min.png'
import ferfiHajvagasImage from '../../../../public/services/service-ferfi-hajvagas-min.png'
import hajfestesImage from '../../../../public/services/service-hajfestes-min.png'
import hajgondoritesImage from '../../../../public/services/service-hajgondorites-min.png'
import noiHajvagasImage from '../../../../public/services/service-noi-hajvagas-min.png'
import szinfelfrissitesImage from '../../../../public/services/service-szinfelfrissites-min.png'
import szinkorrekcioImage from '../../../../public/services/service-szinkorrekcio-min.png'
import tofestesImage from '../../../../public/services/service-tofestes-min.png'
import toszokitesImage from '../../../../public/services/service-toszokites-min.png'
import { Service } from '../types/service.type'

export const SERVICES: Service[] = [
  {
    duration: 75,
    name: 'Női Hajvágás',
    shortDescription:
      'Stílusos női hajvágás, amely kiemeli ,és harmonizál egyéniségeddel.',
    longDescription:
      'Női hajvágásainkat a legújabb divatirányzatok inspirálják, ugyanakkor figyelembe vesszük arcformád, hajtípusod és személyes stílusod, hogy a végeredmény tökéletesen passzoljon hozzád. Akár rövidebb, frissítő hajvágást szeretnél vagy egy teljesen új hajforma váltást, esetleg egy fru-frut, szalonunkba minden elképzelést kivitelezünk közösen.',
    image: noiHajvagasImage,
    queryParam: 'szolgaltatas=noi-hajvagas',
  },
  {
    duration: 45,
    name: 'Férfi Hajvágás',
    shortDescription:
      'Professzionális férfi hajvágás modern vagy klasszikus stílusban, hajvágógéppel, ollóval.',
    longDescription:
      'A szalonban a frizurát az arc és fej formádhoz igazítjuk a könnyen kezelhetőség érdekében. A hajvágás nem csupán a stílusról, hanem az egyéni megjelenésről és a mindennapi praktikumról is szól. Célunk, hogy magabiztosan érezd magad a mindennapokban és neked a lehető legkevesebb dolgod legyen vele a hétköznapokon.',
    image: ferfiHajvagasImage,
    queryParam: 'szolgaltatas=ferfi-hajvagas',
  },
  {
    duration: 30,
    name: 'Hajgöndörítés',
    shortDescription:
      'Tartós göndörítés hajformázóval a természetes, laza hullámokért és a nagyobb volumenért, eseményre vagy akár csak a hétköznapokra.',
    longDescription:
      'A hajgöndörítés szolgáltatásunkkal varázslatos, tartós hullámokat vagy göndörséget adunk hajadnak, amely könnyed, természetes és látványos. Akár finom hullámokra, akár erős göndörségre vágysz, profi technikáink és eszközeink segítenek elérni a kívánt hatást.',
    image: hajgondoritesImage,
    queryParam: 'szolgaltatas=hajgondorites',
  },
  {
    duration: 90,
    name: 'Tőfestés',
    shortDescription:
      'Személyre szabott, egységes hajtőszín, amely élénk, fényes hatást kölcsönöz, és tökéletesen elfedi az ősz hajszálakat.',
    longDescription:
      'Tőfestési szolgáltatásunkkal a lenőtt natúr hajtő színét tökéletesen igazítjuk a meglévő festett hajszínhez, így egységes, friss megjelenést biztosítunk. A professzionális, természetes alapanyagú festékek fényt adnak a hajnak, felfrissítik a kopott hajhossz színét, és szükség esetén elfedik az ősz hajszálakat, hogy hajad egészséges, élénk és ragyogó maradjon.',
    image: tofestesImage,
    queryParam: 'szolgaltatas=tofestes',
  },
  {
    duration: 150,
    name: 'Tőszőkités (árnyalással)',
    shortDescription:
      'A lenőtt hajtő világosítása és árnyalása a már szőkített hajhosszhoz illeszkedve, egységes és természetes szőke megjelenésért.',
    longDescription:
      'A lenőtt, natúr hajtövek szőkítése és árnyalása segít abban, hogy egységes, ragyogó szőke árnyalatot kapjunk, amely tökéletesen illeszkedik a korábban szőkített hajhosszhoz. Ez a technika ideális azok számára, akik szeretnék felfrissíteni szőke hajszínüket, és egységes, harmonikus megjelenést kívánnak elérni.',
    image: toszokitesImage,
    queryParam: 'szolgaltatas=toszokites',
  },
  {
    duration: 150,
    name: 'Hajfestés, teljes hajhosszon',
    shortDescription:
      'Természetes, és tartós hajszín, amely új életet visz a frizurádba, egyéniségedhez igazítva.',
    longDescription:
      'Professzionális, természetes alapú festékeinkkel új életet viszünk frizurádba, feltöltjük és fényessé tesszük a hajad, miközben tartós, egyéniségedhez és igényeidhez illeszkedő színt biztosítunk. Hajfestés szolgáltatásunkkal a legújabb technikákat alkalmazva elérjük, hogy az ősz hajszálak is tökéletes fedést kapjanak, hajad pedig egészséges, vibráló maradjon. Bízd ránk a megjelenésed megújítását, és élvezd az új színek magabiztosságot adó frissességét',
    image: hajfestesImage,
    queryParam: 'szolgaltatas=hajfestes',
  },
  {
    duration: 60,
    name: 'Színfelfrissítés, árnyalás',
    shortDescription:
      'Az árnyalás frissíti a kifakult hajszínt, visszaadva a haj eredeti, ragyogó tónusát és természetes fényét.',
    longDescription:
      'Az árnyalás egy professzionális színfrissítő technika, amely a hajhossz kifakult színeit újra életre kelti. Kiváló megoldás, ha szeretnéd felfrissíteni a hajszínt anélkül, hogy teljes hajfestésre lenne szükséged. Az árnyalás során tonizáljuk a hajat, így a korábban szőkített vagy festett hajszín visszanyeri vibráló, természetes árnyalatát, miközben fényt és ápolást kap.',
    image: szinfelfrissitesImage,
    queryParam: 'szolgaltatas=szinfelfrissites',
  },
  {
    duration: 240,
    name: 'Balayage és Ombre festés',
    shortDescription:
      'Az ombre és balayage hajfestés egyedi, természetes hatású melír technikák, amelyek lágy színátmenetet adnak a hajnak.',
    longDescription:
      'Az ombre határozottabb, fokozatos átmenetet képez, ahol a hajvégek világosabbak, míg a tövek sötétebbek maradnak, így a színek kontrasztosabbak. Ezzel szemben a balayage természetes, napszítta hatást kelt, tőhöz közel világosítva finom átmenettel, lágy színekkel, amelyek kiemelik a haj textúráját. Mindkét technika hosszan tartó, könnyen karbantartható megoldás, tökéletes választás a friss, természetes megjelenésért.',
    image: balayageImage,
    queryParam: 'szolgaltatas=balayage-ombre',
  },
  {
    duration: 240,
    name: 'Szőkítés és Színkorrekció',
    shortDescription:
      'Természetes, fényes szőke árnyalatok, kíméletes világosítási eljárással, amely egészséges és ragyogó megjelenést biztosít a hajnak.',
    longDescription:
      'Szőkítési és színkorrekciós szolgáltatásunk célja, hogy a hajad egységes és ragyogó megjelenést kapjon, különösen, ha korábban otthoni festés, vagy foltos színezés után kell helyreállítani. A színkorrekció során javítjuk az elrontott, egyenetlen színeket és foltokat, míg a teljes szőkítés során a hajad egészen a hajtőtől a végekig, világos és egységes szőke árnyalatot kap. A természetes alapanyagú professzionális termékeinkel garantáljuk, hogy a hajad egészségesen fénylő és élettel teli marad a folyamat végén is.',
    image: szinkorrekcioImage,
    queryParam: 'szolgaltatas=szokites-szinkorrekcio',
  },
]
