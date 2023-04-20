const { Configuration, OpenAIApi } = require("openai");

const configuration = new Configuration({
  apiKey: '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',
});
const openai = new OpenAIApi(configuration);


const axios = require('axios');


async function getLinkedInProfileInfo(user) {
  console.log("getLinkedInProfileInfo");
  const accessToken = user.accessToken;

  try {
    const profileResponse = await axios.get(`https://api.linkedin.com/v2/me?projection=(id,localizedFirstName,localizedLastName,profilePicture(displayImage~:playableStreams),positions*(id,title,company,startDate,endDate,location,description))`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Connection': 'Keep-Alive',
        'Accept': 'application/json'
      }
    });    

    const profileData = profileResponse.data;

    console.log(profileData);

    return profileData;
  } catch (error) {
    console.log(`Error fetching LinkedIn profile: ${error}`);
    return null;
  }
}


async function generateCV(cvText) {
  // Prepare data to pass to the OpenAI API
  console.log("generateCV");
  // console.log(user);
  // const profileData = await getLinkedInProfileInfo(user);
  // console.log(profileData);

 

  console.log("got profile data");
  // console.log(profileData);

  // Call the OpenAI API
  const response = await openai.createCompletion({
    model: "text-davinci-003",
    prompt: `Generate an improved CV based on the following information:\n\n${cvText}\n`,
    max_tokens: 1000,
    n: 1,
    stop: null,
    temperature: 0.5,
  });

  console.log("got response from openAI");
  console.log(response);

  return response.data.choices[0].text;
}


module.exports = generateCV;