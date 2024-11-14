type Category = {
  id: string;
  type: string;
  code: string;
  desc: string;
  flow: string;
  subCategories?: {
    id: string;
    type: string;
    code: string;
    desc: string;
    flow: string;
  }[];
};

type ApiResponse = {
  data: {
    id: string;
    type: string;
    attributes: {
      categories: Category[];
    };
  };
};

function processData(response: ApiResponse): Record<string, { code: string; desc: string }[]> {
  const result: Record<string, { code: string; desc: string }[]> = {};

  response.data.attributes.categories.forEach((category) => {
    const key = category.code;

    if (category.subCategories && category.subCategories.length > 0) {
      result[key] = category.subCategories.map((subCat) => ({
        code: subCat.code,
        desc: subCat.desc,
      }));
    } else {
      result[key] = [{ code: category.code, desc: category.desc }];
    }
  });

  return result;
}

// Example usage with your API response
const apiResponse: ApiResponse = {
  data: {
    id: "25711601-18ed-4f08-927c-ac8a6a99c430",
    type: "idvRefType",
    attributes: {
      categories: [
        {
          id: "108",
          type: "PBIDVCONU",
          code: "CTY",
          desc: "COUNTRIES LIST",
          flow: "PBIDV",
          subCategories: [
            {
              id: "113",
              type: "PBIDVSSYS",
              code: "PBIDVSS",
              desc: "Source System",
              flow: "PBIDV",
            },
          ],
        },
        {
          id: "133",
          type: "PBIDVSTATUS",
          code: "CSTATUS",
          desc: "CASE STATUS",
          flow: "PBIDV",
        },
      ],
    },
  },
};

console.log(processData(apiResponse));


import React, (createContext, useState, useEffect, ReactNode} from 'react';

import processRefData from './processRef Data'

interface AppContextType {

refData: any:

loading: boolean;

error: string | null;

export const AppContext createContext<AppContextType | undefined>(undefined);

interface AppProviderProps {

children: ReactNode;

}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {

const [refData, setRefData] useState<any>(null);

const [loading, setLoading] useState<boolean>(true);

const lerror, setError] useState string | null>(null);

useEffect(() => {

const fetchRefData async() => {

try {

setLoading(true);

const response = await fetch('https://api.example.com/refData');

if (!response.ok) {

throw new Error('Failed to fetch refData');

}

const result await response.json();

const processedRefData= processRefData (result)

setRefData(processedRefData);

} catch (err) {

setError((err as Error).message);

} finally {

setLoading(false);

}

};

fetchRefData();

}, 11);

return (

<AppContext.Provider value={{ refData, loading, error }}> (children)

</AppContext.Provider>

);

};

0 [TypeScript importer]: Symbols:


type Category = {

id: string;

type: string;

code: string;

desc: string;

flow: string;

subCategories?: {

id: string;

type: string;

code: string;

desc: string;

flow: string;

)11:

};

type ApiResponse = {

data: {

id: string;

type: string;

attributes: <

categories: Category[];

function processRef Data(response: ApiResponse): Record string, code: string; desc: string[]> {

const result: Record<string, ( code: string; desc: string[]> = {};

response.data.attributes.categories.forEach((category) => {

const key category.code;

if (category.subCategories && category.subCategories.length > 0) {

result[key] = category.subCategories.map((subCat) => {{ I

code: subCat.code,

desc: subCat.desc,

} else {

result [key] = [{ code: category.code, desc: category.desc}; }

H:

return result;

export default processRef Data
