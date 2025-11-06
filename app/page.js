'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function HomePage() {
  const [form, setForm] = useState({
    name: '',
    phone: '',
    // countryCode: '+971',
    email:"",
  
    terms: false,
    privacy: true,
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [lang, setLang] = useState('en');
  const [submitted, setSubmitted] = useState(false);
  const [customerId, setCustomerId] = useState('');

  const t = translations[lang];

  // ✅ WhatsApp validation helper
  const validatePhone = (num) => {
    const cleaned = num.replace(/\D/g, '');
    return cleaned.length >= 9 && cleaned.length <= 15;
  };

  // async function handleSubmit(e) {
  //   e.preventDefault();
  //   if (!form.name || !form.phone || !form.terms || !form.privacy)
  //     return setError(t.errorRequired);

  //   if (!validatePhone(form.phone))
  //     return setError(t.errorInvalidPhone);

  //   setLoading(true);
  //   try {
  //     const res = await fetch('/api/submit', {
  //       method: 'POST',
  //       headers: { 'Content-Type': 'application/json' },
  //       body: JSON.stringify({
  //         ...form,
  //         phone: `${form.countryCode}${form.phone.replace(/\D/g, '')}`,
  //       }),
  //     });
  //     const data = await res.json();
  //     if (!res.ok) throw new Error(data.error);

  //     // ✅ Set success
  //     setSubmitted(true);

  //     // ✅ Extract customer ID from cookie
  //     const match = document.cookie.match(/(^| )lottery_user=([^;]+)/);
  //     if (match) setCustomerId(match[2]);
  //   } catch (err) {
  //     setError(err.message);
  //   } finally {
  //     setLoading(false);
  //   }
  // }
async function handleSubmit(e) {
  e.preventDefault();
  if (!form.name )
    return setError("name");
  if (!form.phone)
    return setError("phone");
  if (!form.email)
    return setError("emial");

 
  if (!form.terms)
    return setError("terms");



  if (!validatePhone(form.phone))
    return setError(t.errorInvalidPhone);

  setLoading(true);
  try {
    const res = await fetch('/api/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...form,
        // phone: `${form.countryCode}${form.phone.replace(/\D/g, '')}`,
         phone: `${form.phone.replace(/\D/g, '')}`,
      
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.error || 'Something went wrong');
      return;
    }

    // ✅ Success
    setSubmitted(true);
    setCustomerId(data.uniqueId); // directly from response
  } catch (err) {
    setError(err.message);
  } finally {
    setLoading(false);
  }
}

  // ✅ If submitted, show Thank You section
  if (submitted) {
    return (
      <div
        style={{
          minHeight: '100vh',
          background: '#0f0f0f',
          color: '#fff',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          textAlign: 'center',
          fontFamily: "'Poppins', sans-serif",
          padding: 20,
        }}
      >
        {/* Language Toggle */}
        <div className="lang-toggle" style={{ marginBottom: 20 }}>
          <button
            onClick={() => setLang('en')}
            style={{
              background: lang === 'en' ? '#d6af66' : 'transparent',
              color: lang === 'en' ? '#000' : '#fff',
              marginRight: 8,
            }}
          >
            EN
          </button>
          <button
            onClick={() => setLang('ru')}
            style={{
              background: lang === 'ru' ? '#d6af66' : 'transparent',
              color: lang === 'ru' ? '#000' : '#fff',
            }}
          >
            RU
          </button>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Image src="/logo.PNG" alt="Logo" width={230} height={230} priority />
        </div>

        <h1 style={{ fontSize: '2.2rem', color: '#d6af66', marginBottom: 10 }} className='thank-title'>
          🎉 {t.thankYou}
        </h1>
        <p style={{ fontSize: '1rem', color: '#ccc', maxWidth: 500 }} className='font2'>
          {t.success}
        </p>

        {customerId ? (
          <p style={{ marginTop: 20, fontSize: '1.2rem', color: '#d6af66' }} className='font2'>
            {t.customerId}: <strong>{customerId}</strong>
          </p>
        ) : (
          <p style={{ marginTop: 20, color: '#aaa' }}>{t.loading}</p>
        )}
      </div>
    );
  }

  // ✅ Otherwise, show registration form
  return (
    <div className="container">
      {/* 🌐 Language Toggle */}
      <div className="lang-toggle">
        <button
          onClick={() => setLang('en')}
          style={{
            background: lang === 'en' ? '#d6af66' : 'transparent',
            color: lang === 'en' ? '#000' : '#fff',
          }}
        >
          EN
        </button>
        <button
          onClick={() => setLang('ru')}
          style={{
            background: lang === 'ru' ? '#d6af66' : 'transparent',
            color: lang === 'ru' ? '#000' : '#fff',
          }}
        >
          RU
        </button>
      </div>

      {/* 🎟️ Registration Card */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          maxWidth: 600,
          width: '100%',
        }}
        className='registration-card'
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }} className='main-logo'>
          <Image src="/logo.PNG" alt="Logo" width={230} height={230} className="logo" priority />
        </div>

        <div className="card">
          <h1 className="title">🎉 {t.title}</h1>
          <form onSubmit={handleSubmit}>
            {/* Name */}
            <div className="form-group font2">
              <input
                type="text"
                placeholder=" "
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
                className="font2"
              />
              <label className="font2 name-label">{t.fullName}</label>
            </div>

            {/* Phone */}
            <div className="form-group phone-input">
              <div className="phone-wrapper">
                {/* <select
                  value={form.countryCode || '+971'}
                  onChange={(e) => setForm({ ...form, countryCode: e.target.value })}
                  className="country-select font2"
                >
                   <option value="+93">🇦🇫 +93 &nbsp;&nbsp;&nbsp;Afghanistan</option>
  <option value="+355">🇦🇱 +355 &nbsp;Albania</option>
  <option value="+213">🇩🇿 +213 &nbsp;Algeria</option>
  <option value="+376">🇦🇩 +376 &nbsp;Andorra</option>
  <option value="+244">🇦🇴 +244 &nbsp;Angola</option>
  <option value="+54">🇦🇷 +54 &nbsp;&nbsp;&nbsp;Argentina</option>
  <option value="+374">🇦🇲 +374 &nbsp;Armenia</option>
  <option value="+43">🇦🇹 +43 &nbsp;&nbsp;&nbsp;Austria</option>
  <option value="+994">🇦🇿 +994 &nbsp;Azerbaijan</option>
  <option value="+973">🇧🇭 +973 &nbsp;Bahrain</option>
  <option value="+880">🇧🇩 +880 &nbsp;Bangladesh</option>
  <option value="+375">🇧🇾 +375 &nbsp;Belarus</option>
  <option value="+32">🇧🇪 +32 &nbsp;&nbsp;&nbsp;Belgium</option>
  <option value="+591">🇧🇴 +591 &nbsp;Bolivia</option>
  <option value="+387">🇧🇦 +387 &nbsp;Bosnia and Herzegovina</option>
  <option value="+55">🇧🇷 +55 &nbsp;&nbsp;&nbsp;Brazil</option>
  <option value="+359">🇧🇬 +359 &nbsp;Bulgaria</option>
  <option value="+226">🇧🇫 +226 &nbsp;Burkina Faso</option>
  <option value="+257">🇧🇮 +257 &nbsp;Burundi</option>
  <option value="+855">🇰🇭 +855 &nbsp;Cambodia</option>
  <option value="+237">🇨🇲 +237 &nbsp;Cameroon</option>
  <option value="+1">🇨🇦 +1 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Canada</option>
  <option value="+236">🇨🇫 +236 &nbsp;Central African Republic</option>
  <option value="+235">🇹🇩 +235 &nbsp;Chad</option>
  <option value="+56">🇨🇱 +56 &nbsp;&nbsp;&nbsp;Chile</option>
  <option value="+86">🇨🇳 +86 &nbsp;&nbsp;&nbsp;China</option>
  <option value="+57">🇨🇴 +57 &nbsp;&nbsp;&nbsp;Colombia</option>
  <option value="+269">🇰🇲 +269 &nbsp;Comoros</option>
  <option value="+243">🇨🇩 +243 &nbsp;Congo (DRC)</option>
  <option value="+242">🇨🇬 +242 &nbsp;Congo (Republic)</option>
  <option value="+682">🇨🇰 +682 &nbsp;Cook Islands</option>
  <option value="+506">🇨🇷 +506 &nbsp;Costa Rica</option>
  <option value="+225">🇨🇮 +225 &nbsp;Côte d’Ivoire</option>
  <option value="+385">🇭🇷 +385 &nbsp;Croatia</option>
  <option value="+53">🇨🇺 +53 &nbsp;&nbsp;&nbsp;Cuba</option>
  <option value="+357">🇨🇾 +357 &nbsp;Cyprus</option>
  <option value="+420">🇨🇿 +420 &nbsp;Czech Republic</option>
  <option value="+45">🇩🇰 +45 &nbsp;&nbsp;&nbsp;Denmark</option>
  <option value="+253">🇩🇯 +253 &nbsp;Djibouti</option>
  <option value="+20">🇪🇬 +20 &nbsp;&nbsp;&nbsp;Egypt</option>
  <option value="+503">🇸🇻 +503 &nbsp;El Salvador</option>
  <option value="+240">🇬🇶 +240 &nbsp;Equatorial Guinea</option>
  <option value="+291">🇪🇷 +291 &nbsp;Eritrea</option>
  <option value="+372">🇪🇪 +372 &nbsp;Estonia</option>
  <option value="+251">🇪🇹 +251 &nbsp;Ethiopia</option>
  <option value="+298">🇫🇴 +298 &nbsp;Faroe Islands</option>
  <option value="+679">🇫🇯 +679 &nbsp;Fiji</option>
  <option value="+358">🇫🇮 +358 &nbsp;Finland</option>
  <option value="+33">🇫🇷 +33 &nbsp;&nbsp;&nbsp;France</option>
  <option value="+594">🇬🇫 +594 &nbsp;French Guiana</option>
  <option value="+689">🇵🇫 +689 &nbsp;French Polynesia</option>
  <option value="+241">🇬🇦 +241 &nbsp;Gabon</option>
  <option value="+220">🇬🇲 +220 &nbsp;Gambia</option>
  <option value="+995">🇬🇪 +995 &nbsp;Georgia</option>
  <option value="+49">🇩🇪 +49 &nbsp;&nbsp;&nbsp;Germany</option>
  <option value="+233">🇬🇭 +233 &nbsp;Ghana</option>
  <option value="+350">🇬🇮 +350 &nbsp;Gibraltar</option>
  <option value="+30">🇬🇷 +30 &nbsp;&nbsp;&nbsp;Greece</option>
  <option value="+299">🇬🇱 +299 &nbsp;Greenland</option>
  <option value="+502">🇬🇹 +502 &nbsp;Guatemala</option>
  <option value="+44">🇬🇧 +44 &nbsp;&nbsp;&nbsp;United Kingdom</option>
  <option value="+240">🇬🇶 +240 &nbsp;Equatorial Guinea</option>
  <option value="+224">🇬🇳 +224 &nbsp;Guinea</option>
  <option value="+245">🇬🇼 +245 &nbsp;Guinea-Bissau</option>
  <option value="+595">🇵🇾 +595 &nbsp;Paraguay</option>
  <option value="+509">🇭🇹 +509 &nbsp;Haiti</option>
  <option value="+504">🇭🇳 +504 &nbsp;Honduras</option>
  <option value="+852">🇭🇰 +852 &nbsp;Hong Kong</option>
  <option value="+36">🇭🇺 +36 &nbsp;&nbsp;&nbsp;Hungary</option>
   <option value="+91">🇮🇳 +91 &nbsp; &nbsp;India</option>
  <option value="+62">🇮🇩 +62 &nbsp;&nbsp;&nbsp;Indonesia</option>
  <option value="+98">🇮🇷 +98 &nbsp;&nbsp;&nbsp;Iran</option>
  <option value="+964">🇮🇶 +964 &nbsp;Iraq</option>
  <option value="+353">🇮🇪 +353 &nbsp;Ireland</option>
  <option value="+972">🇮🇱 +972 &nbsp;Israel</option>
  <option value="+39">🇮🇹 +39 &nbsp;&nbsp;&nbsp;Italy</option>
  <option value="+81">🇯🇵 +81 &nbsp;&nbsp;&nbsp;Japan</option>
  <option value="+962">🇯🇴 +962 &nbsp;Jordan</option>
  <option value="+7">🇷🇺 +7 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Russia</option>
  <option value="+82">🇰🇷 +82 &nbsp;&nbsp;&nbsp;South Korea</option>
  <option value="+965">🇰🇼 +965 &nbsp;Kuwait</option>
  <option value="+60">🇲🇾 +60 &nbsp;&nbsp;&nbsp;Malaysia</option>
  <option value="+52">🇲🇽 +52 &nbsp;&nbsp;&nbsp;Mexico</option>
  <option value="+234">🇳🇬 +234 &nbsp;Nigeria</option>
  <option value="+31">🇳🇱 +31 &nbsp;&nbsp;&nbsp;Netherlands</option>
  <option value="+64">🇳🇿 +64 &nbsp;&nbsp;&nbsp;New Zealand</option>
  <option value="+47">🇳🇴 +47 &nbsp;&nbsp;&nbsp;Norway</option>
  <option value="+48">🇵🇱 +48 &nbsp;&nbsp;&nbsp;Poland</option>
  <option value="+351">🇵🇹 +351 &nbsp;Portugal</option>
  <option value="+974">🇶🇦 +974 &nbsp;Qatar</option>
  <option value="+40">🇷🇴 +40 &nbsp;&nbsp;&nbsp;Romania</option>
  <option value="+966">🇸🇦 +966 &nbsp;Saudi Arabia</option>
  <option value="+65">🇸🇬 +65 &nbsp;&nbsp;&nbsp;Singapore</option>
  <option value="+27">🇿🇦 +27 &nbsp;&nbsp;&nbsp;South Africa</option>
  <option value="+34">🇪🇸 +34 &nbsp;&nbsp;&nbsp;Spain</option>
  <option value="+46">🇸🇪 +46 &nbsp;&nbsp;&nbsp;Sweden</option>
  <option value="+41">🇨🇭 +41 &nbsp;&nbsp;&nbsp;Switzerland</option>
  <option value="+886">🇹🇼 +886 &nbsp;Taiwan</option>
  <option value="+66">🇹🇭 +66 &nbsp;&nbsp;&nbsp;Thailand</option>
  <option value="+90">🇹🇷 +90 &nbsp;&nbsp;&nbsp;Turkey</option>
  <option value="+971">🇦🇪 +971 &nbsp;United Arab Emirates</option>
  <option value="+1">🇺🇸 +1 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;United States</option>
  <option value="+84">🇻🇳 +84 &nbsp;&nbsp;&nbsp;Vietnam</option>
  <option value="+998">🇺🇿 +998 &nbsp;Uzbekistan</option>
                </select> */}
                <input
                  type="text"
                  placeholder=" "
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  required
                  className="font2"
                />

                {/* phone-label */}
                <label className="name-label font2">{t.phone}</label> 
              </div>
            </div>

            <div className="form-group font2">
              <input
                type="email"
                placeholder=" "
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
                className="font2"
              />
              <label className="font2 name-label">{t.email}</label>
            </div>
             {/* <div className="form-group font2">
              <input
                type="text"
                placeholder=" "
                value={form.tableNumber}
                onChange={(e) => setForm({ ...form, tableNumber: e.target.value })}
                required
                className="font2"
              />
              <label className="font2 name-label">{t.tableno}</label>
            </div>
            <div className="form-group font2">
              <input
                type="text"
                placeholder=" "
                value={form.seatNumber}
                onChange={(e) => setForm({ ...form, seatNumber: e.target.value })}
                required
                className="font2"
              />
              <label className="font2 name-label">{t.seatno}</label>
            </div> */}
           

            {/* Checkboxes */}
            <div className="checkboxes">
              <label className="font2">
                <input
                  type="checkbox"
                  checked={form.terms}
                  onChange={(e) => setForm({ ...form, terms: e.target.checked })}
                />{' '}
                <span className="text-desktop">
                  I have read and agree to the{' '}
                  <a href="https://www.doremi.art/terms-and-conditions" target="_blank" className="link-text">
                    Terms & Conditions
                  </a>.
                </span>
                <span className="text-mobile">
                  I accept the{' '}
                  <a href="https://www.doremi.art/terms-and-conditions" target="_blank" className="link-text">
                    Terms & Conditions
                  </a>.
                </span>
              </label>
            </div>

            {error && <div className="error">{error}</div>}

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'end' }}>
              <button className="btn" type="submit" disabled={loading}>
                {loading ? t.submitting : t.enterDraw}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

// ✅ Translations (merged both page texts)
const translations = {
  en: {
    title: 'Join the Lottery Draw!',
    fullName: 'Full Name',
    phone: 'Mobile Number',
    email:'Email',
    tableno:'Table Number',
    seatno:'Seat Number',
    errorRequired: 'Please fill all required fields',
    errorInvalidPhone: 'Please enter a valid WhatsApp number',
    enterDraw: 'Enter the Draw',
    submitting: 'Submitting...',
    thankYou: 'Thank You for Registering!',
    success: 'Your entry has been successfully submitted. Winners will be announced soon!',
    customerId: 'Your Customer ID',
    loading: 'Loading your details...',
  },
  ru: {
    title: 'Присоединяйтесь к розыгрышу призов!',
    fullName: 'ФИО',
    phone: 'Номер мобильного телефона',
    email:'Электронная почта',
    tableno:'Номер стола',
    seatno:'Номер места',
    errorRequired: 'Пожалуйста, заполните обязательные поля',
    errorInvalidPhone: 'Введите действительный номер WhatsApp',
    enterDraw: 'Принять участие',
    submitting: 'Отправка...',
    thankYou: 'Спасибо за регистрацию!',
    success: 'Ваша заявка успешно отправлена. Победители будут объявлены в ближайшее время!',
    customerId: 'Ваш идентификатор клиента',
    loading: 'Загрузка ваших данных...',
  },
};
