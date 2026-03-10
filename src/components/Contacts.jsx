import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { COLORS } from '../constants';
import { supabase } from '../lib/supabase';

export default function Contacts() {
  const { t, i18n } = useTranslation('common');
  const [formData, setFormData] = useState({ nome: '', cognome: '', email: '', telefono: '', tipoViaggio: '', messaggio: '' });
  const [status, setStatus] = useState('idle'); // idle | loading | success | error
  const [errorMsg, setErrorMsg] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (fieldErrors[name]) setFieldErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const validate = () => {
    const errors = {};
    if (!formData.email.includes('@')) {
      errors.email = t('contacts.errorEmail');
    }
    const phone = formData.telefono.trim();
    if (phone) {
      const digits = phone.replace(/[^0-9]/g, '');
      if (digits.length === 0 || digits.length > 14 || !/^\+?[0-9\s]+$/.test(phone)) {
        errors.telefono = t('contacts.errorPhone');
      }
    }
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setStatus('loading');
    setErrorMsg('');

    const { error } = await supabase.from('contacts').insert({
      nome: formData.nome.trim(),
      cognome: formData.cognome.trim(),
      email: formData.email.trim().toLowerCase(),
      telefono: formData.telefono.trim() || null,
      tipo_viaggio: formData.tipoViaggio || null,
      messaggio: formData.messaggio.trim() || null,
      lingua: i18n.language,
      pagina: window.location.pathname,
    });

    if (error) {
      console.error('Supabase insert error:', error);
      setStatus('error');
      setErrorMsg(t('contacts.errorMsg'));
    } else {
      setStatus('success');
    }
  };

  const travelOptions = [
    { value: 'coppia', label: t('contacts.optionCouple') },
    { value: 'famiglia', label: t('contacts.optionFamily') },
    { value: 'amici', label: t('contacts.optionFriends') },
    { value: 'solitario', label: t('contacts.optionSolo') },
    { value: 'pet-friendly', label: t('contacts.optionPet') },
  ];

  const isLoading = status === 'loading';

  const inputBorder = (field) => fieldErrors[field] ? '#f87171' : COLORS.goldLight;

  return (
    <section id="contatti" className="py-24 px-6 md:px-16" style={{ backgroundColor: COLORS.charcoal }}>
      <div className="max-w-2xl mx-auto">
        <p className="font-mono-data text-xs tracking-widest uppercase mb-4" style={{ color: COLORS.gold }}>{t('contacts.eyebrow')}</p>
        <h2
          className="font-outfit font-bold leading-tight mb-4"
          style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', letterSpacing: '-0.03em', color: COLORS.white }}
        >
          {t('contacts.title')}{' '}
          <span style={{ fontFamily: '"Cormorant Garamond", serif', fontStyle: 'italic', color: COLORS.gold, fontSize: '1.15em' }}>
            {t('contacts.titleAccent')}
          </span>
        </h2>
        <p className="font-sans text-sm mb-10" style={{ color: COLORS.greyMid }}>
          {t('contacts.subtitle')}
        </p>

        {status === 'success' ? (
          <div className="rounded-4xl p-10 text-center border" style={{ backgroundColor: `${COLORS.white}08`, borderColor: COLORS.goldLight }}>
            <p className="font-outfit font-bold text-2xl mb-2" style={{ color: COLORS.white }}>{t('contacts.thankYou')}</p>
            <p className="font-sans text-sm" style={{ color: COLORS.greyMid }}>{t('contacts.thankYouMsg')}</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
            <div className="grid md:grid-cols-2 gap-5">
              <div>
                <label className="font-mono-data text-xs block mb-2" style={{ color: COLORS.greyMid }}>{t('contacts.labelFirstName')}</label>
                <input
                  type="text" name="nome" value={formData.nome} onChange={handleChange} required disabled={isLoading}
                  className="w-full rounded-2xl px-5 py-4 font-sans text-sm border focus:outline-none transition-colors"
                  style={{ backgroundColor: `${COLORS.white}0a`, borderColor: COLORS.goldLight, color: COLORS.white }}
                  placeholder={t('contacts.placeholderFirstName')}
                />
              </div>
              <div>
                <label className="font-mono-data text-xs block mb-2" style={{ color: COLORS.greyMid }}>{t('contacts.labelLastName')}</label>
                <input
                  type="text" name="cognome" value={formData.cognome} onChange={handleChange} required disabled={isLoading}
                  className="w-full rounded-2xl px-5 py-4 font-sans text-sm border focus:outline-none transition-colors"
                  style={{ backgroundColor: `${COLORS.white}0a`, borderColor: COLORS.goldLight, color: COLORS.white }}
                  placeholder={t('contacts.placeholderLastName')}
                />
              </div>
            </div>
            <div>
              <label className="font-mono-data text-xs block mb-2" style={{ color: COLORS.greyMid }}>{t('contacts.labelEmail')}</label>
              <input
                type="email" name="email" value={formData.email} onChange={handleChange} required disabled={isLoading}
                className="w-full rounded-2xl px-5 py-4 font-sans text-sm border focus:outline-none transition-colors"
                style={{ backgroundColor: `${COLORS.white}0a`, borderColor: inputBorder('email'), color: COLORS.white }}
                placeholder={t('contacts.placeholderEmail')}
              />
              {fieldErrors.email && <p className="font-sans text-xs mt-1.5" style={{ color: '#f87171' }}>{fieldErrors.email}</p>}
            </div>
            <div className="grid md:grid-cols-2 gap-5">
              <div>
                <label className="font-mono-data text-xs block mb-2" style={{ color: COLORS.greyMid }}>{t('contacts.labelPhone')}</label>
                <input
                  type="tel" name="telefono" value={formData.telefono} onChange={handleChange} disabled={isLoading}
                  className="w-full rounded-2xl px-5 py-4 font-sans text-sm border focus:outline-none transition-colors"
                  style={{ backgroundColor: `${COLORS.white}0a`, borderColor: inputBorder('telefono'), color: COLORS.white }}
                  placeholder={t('contacts.placeholderPhone')}
                />
                {fieldErrors.telefono && <p className="font-sans text-xs mt-1.5" style={{ color: '#f87171' }}>{fieldErrors.telefono}</p>}
              </div>
              <div>
                <label className="font-mono-data text-xs block mb-2" style={{ color: COLORS.greyMid }}>{t('contacts.labelTravelType')}</label>
                <select
                  name="tipoViaggio" value={formData.tipoViaggio} onChange={handleChange} disabled={isLoading}
                  className="w-full rounded-2xl px-5 py-4 font-sans text-sm border focus:outline-none transition-colors"
                  style={{ backgroundColor: COLORS.charcoal, borderColor: COLORS.goldLight, color: formData.tipoViaggio ? COLORS.white : COLORS.greyMid }}
                >
                  <option value="" disabled style={{ backgroundColor: COLORS.charcoal }}>{t('contacts.selectDefault')}</option>
                  {travelOptions.map((opt) => (
                    <option key={opt.value} value={opt.value} style={{ backgroundColor: COLORS.charcoal }}>{opt.label}</option>
                  ))}
                </select>
              </div>
            </div>
            <div>
              <label className="font-mono-data text-xs block mb-2" style={{ color: COLORS.greyMid }}>{t('contacts.labelMessage')}</label>
              <textarea
                name="messaggio" value={formData.messaggio} onChange={handleChange} rows={5} disabled={isLoading}
                className="w-full rounded-2xl px-5 py-4 font-sans text-sm border focus:outline-none transition-colors resize-none"
                style={{ backgroundColor: `${COLORS.white}0a`, borderColor: COLORS.goldLight, color: COLORS.white }}
                placeholder={t('contacts.placeholderMessage')}
              />
            </div>

            {status === 'error' && (
              <p className="font-sans text-sm text-center" style={{ color: '#f87171' }}>
                {errorMsg}
              </p>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="btn-magnetic w-full py-5 rounded-full font-bold text-sm mt-2 transition-opacity"
              style={{ backgroundColor: COLORS.goldDark, color: COLORS.white, opacity: isLoading ? 0.6 : 1 }}
            >
              <span className="btn-bg rounded-full" style={{ backgroundColor: COLORS.deep }} />
              <span className="relative z-10">
                {isLoading ? t('contacts.sending') : t('contacts.submit')}
              </span>
            </button>
            <p className="font-mono-data text-xs text-center" style={{ color: `${COLORS.white}40` }}>
              {t('contacts.privacy')}
            </p>
          </form>
        )}
      </div>
    </section>
  );
}
