import BackgroundBlur from "@/components/BackgroundBlur";
import { CONTACT_EMAIL, CONTACT_PHONE } from "@/constants/contact.constants";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Botanic Beauty | Adatvédelmi nyilatkozat",
  description: "Botanic Beauty adatvédelmi nyilatkozat",
  alternates: {
    canonical: "https://botanic-beauty.hu/adatvedelmi-nyilatkozat",
  },
};

const PrivacyPolicyPage = async () => {
  return (
    <div className="min-h-screen pt-32">
      <BackgroundBlur className="mx-auto mb-12">
        <div className="mb-12">
          <h1 className="text-lg font-medium mb-4">Adatvedelmi nyilatkozat</h1>

          <p>
            Ez az adatvédelmi nyilatkozat tájékoztatást nyújt arról, hogyan
            gyűjtjük, használjuk és védjük az Ön személyes adatait. Az
            adatvédelmi szabályzatunk betartja az Európai Unió Általános
            Adatvédelmi Rendeletét (GDPR).
          </p>
        </div>

        <div className="mb-12">
          <h1 className="text-lg font-medium mb-4">
            Milyen adatokat gyűjtünk?
          </h1>

          <p>
            Az időpontfoglalási rendszer használata során az alábbi személyes
            adatokat gyűjtjük:
          </p>

          <ul className="list-disc list-inside">
            <li>Név</li>

            <li>E-mail cím</li>

            <li>Telefonszám</li>
          </ul>
        </div>

        <div className="mb-12">
          <h1 className="text-lg font-medium mb-4">
            Miért gyűjtjük ezeket az adatokat?
          </h1>

          <p>Az adatokat az alábbi célokra használjuk fel:</p>

          <ul className="list-disc list-inside">
            <li>Időpontfoglalás kezelése</li>

            <li>Értesítések küldése a foglalás állapotáról</li>

            <li>Kapcsolattartás szükség esetén</li>
          </ul>
        </div>

        <div className="mb-12">
          <h1 className="text-lg font-medium mb-4">
            Hogyan tároljuk az adatokat?
          </h1>

          <p>
            Az adatokat biztonságos adatbázisban tároljuk, amelyhez csak az arra
            jogosult munkatársaink férhetnek hozzá. Az adatok biztonságát
            különféle technikai és szervezeti intézkedésekkel biztosítjuk.
          </p>
        </div>

        <div className="mb-12">
          <h1 className="text-lg font-medium mb-4">
            Ki fér hozzá az adatokhoz?
          </h1>

          <p>
            Az adatokhoz csak a szalon munkatársai férhetnek hozzá, kizárólag a
            foglalások kezelése céljából.
          </p>
        </div>

        <div className="mb-12">
          <h1 className="text-lg font-medium mb-4">
            Hogyan védjük az adatokat?
          </h1>

          <p>
            Az adatokat korszerű biztonsági intézkedésekkel védjük, beleértve az
            adatbázisok titkosítását és a hozzáférés korlátozását.
          </p>
        </div>

        <div className="mb-12">
          <h1 className="text-lg font-medium mb-4">Felhasználói jogok</h1>

          <p>
            Önnek jogában áll hozzáférni az Önre vonatkozó személyes adatokhoz,
            kérheti azok helyesbítését vagy törlését, valamint jogosult
            tiltakozni az adatkezelés ellen. Kéréseit az alábbi elérhetőségen
            jelezheti:
          </p>
          <p>E-mail: {CONTACT_EMAIL}</p>
          <p>Telefon: {CONTACT_PHONE}</p>
        </div>

        <div className="mb-12">
          <h1 className="text-lg font-medium mb-4">Kapcsolat</h1>

          <p>
            Ha bármilyen kérdése van az adatvédelmi nyilatkozattal kapcsolatban,
            kérjük, lépjen kapcsolatba velünk a fenti elérhetőségeken.
          </p>
        </div>
      </BackgroundBlur>
    </div>
  );
};

export default PrivacyPolicyPage;
