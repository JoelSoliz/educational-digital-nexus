import { Provider } from "ims-lti";
import { NextResponse } from "next/server";
import { parse } from "url";

const consumerKey = "nexus-jdn";
const consumerSecret = "nexus-jdn2";

function jsonToSearchParams(json) {
  const params = new URLSearchParams();
  for (const key in json) {
    if (json.hasOwnProperty(key)) {
      params.append(key, json[key]);
    }
  }
  return params;
}

export async function POST(request) {
  const provider = new Provider(consumerKey, consumerSecret);
  provider.valid_request(request, (err, isValid) => {
    if (err || !isValid) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    console.log(provider.body);
    const user = {
      id: provider.body.user_id,
      name: provider.body.lis_person_name_full,
      email: provider.body.lis_person_contact_email_primary,
    };

    return NextResponse.redirect(`/${jsonToSearchParams(provider.body)}`, {
      status: 307,
    });
  });
}

// export const config = {
//   api: {
//     bodyParser: {
//       urlencoded: true,
//     },
//   },
// };
