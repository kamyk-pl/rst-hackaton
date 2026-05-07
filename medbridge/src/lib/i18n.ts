export const pl = {
  nav: {
    myProfile: "Mój profil",
    documents: "Dokumentacja",
    bookVisit: "Umów wizytę",
    visitHistory: "Historia wizyt",
    mySlots: "Moje terminy",
    schedule: "Harmonogram wizyt",
    logout: "Wyloguj się",
  },
  status: {
    planned: "Zaplanowana",
    completed: "Zakończona",
    available: "Dostępny",
    reserved: "Zarezerwowany",
    doctor: "Lekarz",
    patient: "Pacjent",
  },
  errors: {
    noAccess: "Brak dostępu",
    invalidCredentials: "Nieprawidłowy email lub hasło",
    firstLastNameRequired: "Imię i nazwisko są wymagane",
    allFieldsRequired: "Wszystkie pola są wymagane",
    noConsent: "Zgoda na udostępnienie danych jest wymagana",
    slotUnavailable: "Wybrany termin nie jest już dostępny",
    visitAlreadyCompleted: "Ta wizyta została już zakończona",
    visitNotFound: "Nie znaleziono wizyty",
    selectFile: "Wybierz plik",
    invalidFileFormat: "Dozwolone formaty: PDF, JPG",
    fileTooLarge: "Plik nie może być większy niż 10 MB",
    dateTimeRequired: "Data i godzina są wymagane",
    slotMustBeFuture: "Termin musi być w przyszłości",
  },
  profile: {
    title: "Mój profil",
    editTitle: "Edytuj profil",
    personalData: "Dane osobowe",
    medicalInfo: "Informacje medyczne",
    firstName: "Imię",
    lastName: "Nazwisko",
    dateOfBirth: "Data urodzenia",
    allergies: "Alergie",
    chronicDiseases: "Choroby przewlekłe",
    medications: "Leki przyjmowane na stałe",
    specialization: "Specjalizacja",
    emptyProfile: "Profil nie został jeszcze uzupełniony.",
    fillProfile: "Uzupełnij profil",
    save: "Zapisz",
    cancel: "Anuluj",
  },
  visits: {
    title: "Historia wizyt",
    schedule: "Harmonogram wizyt",
    bookTitle: "Umów wizytę",
    summaryTitle: "Podsumowanie wizyty",
    addSummary: "Dodaj podsumowanie wizyty",
    diagnosis: "Rozpoznanie",
    recommendations: "Zalecenia",
    prescribedMedications: "Przepisane leki",
    referrals: "Skierowania na badania",
    noVisits: "Brak wizyt.",
    bookFirst: "Umów pierwszą wizytę",
    noConsent: "Pacjent nie wyraził zgody na udostępnienie danych.",
    visitNotStarted: "Wizyta jeszcze się nie odbyła lub lekarz nie dodał podsumowania.",
    saveSummary: "Zapisz podsumowanie",
    confirmBooking: "Potwierdź rezerwację",
    consentLabel:
      "Wyrażam zgodę na udostępnienie mojego profilu zdrowotnego oraz dokumentacji medycznej wybranemu lekarzowi w celu realizacji wizyty.",
  },
  documents: {
    title: "Dokumentacja medyczna",
    uploadLabel: "Kliknij, aby wybrać plik",
    uploadHint: "PDF lub JPG, max 10 MB",
    uploading: "Wgrywanie...",
    noDocuments: "Brak dokumentów. Wgraj pierwszy plik powyżej.",
    uploaded: "Wgrane dokumenty",
  },
  slots: {
    title: "Moje terminy",
    addSlot: "Dodaj nowy termin",
    addButton: "Dodaj termin",
    adding: "Dodawanie...",
    noSlots: "Brak terminów. Dodaj pierwszy termin powyżej.",
    date: "Data",
    time: "Godzina",
  },
} as const;

type Leaves<T, P extends string = ""> = {
  [K in keyof T]: T[K] extends string
    ? `${P}${K & string}`
    : Leaves<T[K], `${P}${K & string}.`>;
}[keyof T];

export type TranslationKey = Leaves<typeof pl>;

export function t(key: TranslationKey): string {
  const parts = (key as string).split(".");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let current: any = pl;
  for (const part of parts) {
    if (current === undefined) return key as string;
    current = current[part];
  }
  return typeof current === "string" ? current : (key as string);
}
