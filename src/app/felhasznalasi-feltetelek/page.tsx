import BackgroundBlur from "@/components/BackgroundBlur";
import { CONTACT_EMAIL, CONTACT_PHONE } from "@/constants/contact.constants";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Botanic Beauty | Felhasználási feltételek",
  description: "Botanic Beauty felhasználási feltételek",
  alternates: {
    canonical: "https://botanic-beauty.hu/felhasznalasi-feltetelek",
  },
};

const TermOfUsePage = async () => {
  return (
    <div className="min-h-screen pt-32">
      <BackgroundBlur className="mx-auto mb-12">
        <div className="mb-12">
          <h1 className="text-lg font-medium mb-4">Felhasználási feltételek</h1>

          <p>
            Kérjük, figyelmesen olvassa el az alábbi felhasználási feltételeket,
            mielőtt használatba veszi weboldalunkat. Az oldal használatával Ön
            elfogadja az alábbi feltételeket.
          </p>
        </div>

        <div className="mb-12">
          <h1 className="text-lg font-medium mb-4">Szolgáltatás használata</h1>

          <p>
            Az oldal célja, hogy lehetővé tegye az online időpontfoglalást
            szalonunk szolgáltatásaira. Az oldal használatához nem szükséges
            regisztráció, azonban a foglalás során megadott adatokat az
            adatvédelmi nyilatkozat szerint kezeljük.
          </p>
        </div>

        <div className="mb-12">
          <h1 className="text-lg font-medium mb-4">Felelősség</h1>

          <p>
            Mindent megteszünk annak érdekében, hogy az oldalon található
            információk pontosak és naprakészek legyenek, de nem vállalunk
            felelősséget az esetleges hibákért, elírásokért vagy
            hiányosságokért.
          </p>
        </div>

        <div className="mb-12">
          <h1 className="text-lg font-medium mb-4">
            Felhasználói kötelezettségek
          </h1>

          <p>
            A felhasználók kötelesek valós adatokat megadni az időpontfoglalás
            során. Az oldal bármilyen jogellenes vagy visszaélésszerű használata
            tilos.
          </p>
        </div>

        <div className="mb-12">
          <h1 className="text-lg font-medium mb-4">Kapcsolat</h1>

          <p>
            Ha bármilyen kérdése vagy észrevétele van a felhasználási
            feltételekkel kapcsolatban, kérjük, lépjen kapcsolatba velünk:
          </p>
          <p>E-mail: {CONTACT_EMAIL}</p>
          <p>Telefon: {CONTACT_PHONE}</p>
        </div>
      </BackgroundBlur>
    </div>
  );
};

export default TermOfUsePage;
