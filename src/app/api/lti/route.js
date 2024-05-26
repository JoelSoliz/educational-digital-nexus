import { Provider } from "ims-lti";
import { NextResponse } from "next/server";
import { parse } from "url";

const consumerKey = "";
const consumerSecret = "";

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

    return NextResponse.json(user, { status: 200 });
  });
}

export const config = {
  api: {
    bodyParser: {
      urlencoded: true,
    },
  },
};
