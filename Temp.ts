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