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
  let response = NextResponse.json(
    { message: "Internal error" },
    { status: 500 }
  );
  request.protocol = request.url.startsWith("https") ? "https" : "http";
  const provider = new Provider(consumerKey, consumerSecret);

  const formData = await request.formData();
  const body = {};
  formData.forEach((value, key) => {
    body[key] = value;
  });

  provider.valid_request(request, body, (err, isValid) => {
    console.log(err);
    if (err || !isValid) {
      response = NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
      return;
    }

    console.log(provider.body);
    const user = {
      id: provider.body.user_id,
      name: provider.body.lis_person_name_full,
      email: provider.body.lis_person_contact_email_primary,
    };

    response = NextResponse.redirect(`/${jsonToSearchParams(provider.body)}`, {
      status: 307,
    });
  });

  return response;
}