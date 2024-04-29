"use client";

type ContactFormProps = {
  contactInfo: {
    name: string;
    email: string;
    phone: string;
    otherInfo: string;
  };
  modifyContactInfo: (key: string, value: string) => void;
};

const ContactForm = ({ contactInfo, modifyContactInfo }: ContactFormProps) => {
  return (
    <div>
      <form
        onClick={(event) => event.preventDefault()}
        className="flex flex-col gap-2 mb-4"
      >
        <div>
          <label
            htmlFor="name"
            className="block mb-2 text-sm font-medium text-white"
          >
            Név
          </label>
          <input
            type="text"
            id="name"
            className="border text-sm rounded-lg block w-full p-2.5 bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500"
            value={contactInfo.name}
            onChange={(event) => modifyContactInfo("name", event.target.value)}
          />
        </div>
        <div>
          <label
            htmlFor="email"
            className="block mb-2 text-sm font-medium text-white"
          >
            Email
          </label>
          <input
            type="text"
            id="email"
            className="border text-sm rounded-lg block w-full p-2.5 bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500"
            value={contactInfo.email}
            onChange={(event) => modifyContactInfo("email", event.target.value)}
          />
        </div>
        <div>
          <label
            htmlFor="phone"
            className="block mb-2 text-sm font-medium text-white"
          >
            Telefon
          </label>
          <input
            type="tel"
            id="phone"
            className="border text-sm rounded-lg block w-full p-2.5 bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500"
            value={contactInfo.phone}
            onChange={(event) => modifyContactInfo("phone", event.target.value)}
          />
        </div>
        <div>
          <label
            htmlFor="other-info"
            className="block mb-2 text-sm font-medium text-white"
          >
            Megjegyzés
          </label>
          <textarea
            id="other-info"
            className="border text-sm rounded-lg block w-full p-2.5 bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500"
            cols={30}
            rows={3}
            value={contactInfo.otherInfo}
            onChange={(event) =>
              modifyContactInfo("otherInfo", event.target.value)
            }
          ></textarea>
        </div>
      </form>
    </div>
  );
};

export default ContactForm;
