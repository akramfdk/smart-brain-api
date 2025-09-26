const handleImage = (db) => (req, res) => {
    const {id} = req.body;

    db('users').where('id', '=', id)
    .increment('entries', 1)
    .returning('entries')
    .then(entries => {
        res.json(entries[0].entries)
    })
    .catch(err => res.status(400).json('unable to get entries'))
}


const getURLrequestOptions = (imageUrl) => {
  const PAT = '251fd779de914c769fbc29a916a12cee';
  const USER_ID = 'kz4p8xr695tb';
  const APP_ID = 'smart-brain';
//   const IMAGE_URL = imageUrl;

  const raw = JSON.stringify({
    "user_app_id": {
        "user_id": USER_ID,
        "app_id": APP_ID
    },
    "inputs": [
        {
            "data": {
                "image": {
                    "url": imageUrl
                    // "base64": IMAGE_BYTES_STRING
                }
            }
        }
    ]
  });

  const requestOptions = {
    method: 'POST',
    headers: {
        'Accept': 'application/json',
        'Authorization': 'Key ' + PAT
    },
    body: raw
  };

  return requestOptions;
}


const handleImageUrl = (req, res) => {

    const {input} = req.body;
    const MODEL_ID = 'face-detection';
    const MODEL_VERSION_ID = '6dc7e46bc9124c5c8824be4822abe105';

    fetch("https://api.clarifai.com/v2/models/" + MODEL_ID + "/versions/" + MODEL_VERSION_ID + "/outputs", getURLrequestOptions(input))
    .then(response => response.json())
    .then(data => res.json(data))
    .catch(err => res.status(400).json("unable to work with API"));
}

export { handleImageUrl };
export default handleImage;