const adTransformer = (ad) => {
    if (ad?.photo) {
      ad.photo = process.env.serverUrl + '/uploads/' + ad.photo;
    }
    return ad;
  };
  
  const adsTransformer = (ads) => {
    return ads.map((ad) => adTransformer(ad));
  };
  
  module.exports = {
    adTransformer,
    adsTransformer,
  };
  