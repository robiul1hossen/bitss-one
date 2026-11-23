"use client";

import { createContext, useContext, useState, useEffect } from "react";

const CountryContext = createContext(null);

const defaultCountry = {
  id: 8,
  country_name: "France",
  currency_icon: "&euro;",
  currency_name: "EUR",
  abbreviation: "FR",
  bank_informations: [
    {
      id: 14,
      bank_name: "LCL Bank France",
      acc_holder_name: "BFIN SASU",
      account_no: "FR62 3000 2030 3700 0007 3125 M63",
      branch: null,
      routing_number: null,
      swift_code: "CRLYFRPP",
      type: 1,
      type_name: "bank_transfer",
    },
  ],
};

export function CountryProvider({ children }) {
  // Same initial values on server and client, so hydration matches
  const [selectedCountry, setSelectedCountry] = useState(defaultCountry);
  const [hasChosen, setHasChosen] = useState(false);
  const [isReady, setIsReady] = useState(false); // true once localStorage was read

  // After mount: load the saved country from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem("bitss_country");
      if (stored) {
        setSelectedCountry(JSON.parse(stored));
        setHasChosen(true);
      } else {
        localStorage.setItem("bitss_country", JSON.stringify(defaultCountry));
      }
    } catch {
      localStorage.removeItem("bitss_country");
    }
    setIsReady(true);
  }, []);

  const selectCountry = (country) => {
    setSelectedCountry(country);
    setHasChosen(true);
    localStorage.setItem("bitss_country", JSON.stringify(country));
  };

  const resetCountry = () => {
    setSelectedCountry(null);
    setHasChosen(false);
    localStorage.removeItem("bitss_country");
  };

  return (
    <CountryContext.Provider
      value={{
        selectedCountry,
        hasChosen,
        isReady,
        selectCountry,
        resetCountry,
      }}
    >
      {children}
    </CountryContext.Provider>
  );
}

export function useCountry() {
  const ctx = useContext(CountryContext);
  if (!ctx) throw new Error("useCountry must be used inside CountryProvider");
  return ctx;
}
