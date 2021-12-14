require("dotenv").config();
const axios = require("axios");
const jsC8 = require("jsc8");
const genres = require("./genres");

const jsc8Client = new jsC8({
  url: process.env.GDN_URL,
  apiKey: process.env.API_KEY,
});

const instance = axios.create({
  baseURL: "https://api.themoviedb.org/3",
});

const ASSET_TYPES = {
  MOVIE: "movie",
  TV: "tv",
};
const LANG = "en-US";
const tmdbApiKey = process.env.TMDB_API_KEY;
const genreList = genres;

filterGenreIds = (genreIds) => {
  return genreIds.reduce((genreIds, genreId) => {
    genreList.find((gener) => gener.id === genreId) && genreIds.push(genreId);
    return genreIds;
  }, []);
};

prepareNodesAndEdges = (assets, assetType) => {
  return assets.reduce(
    (data, asset) => {
      asset.genre_ids = filterGenreIds(asset.genre_ids);

      if (!asset.genre_ids.length) return;

      asset.genre_ids.forEach((genre) => {
        data.genreEdges.push({
          _key: `genres-${genre}-assets-${asset.id}`,
          _from: `genres/${genre}`,
          _to: `assets/${asset.id}`,
          asset_type: assetType,
        });
      });

      if (ASSET_TYPES.TV === assetType) {
        data.tvSeriesNodes.push({
          _key: `${asset.id}`,
          ...asset,
        });
      } else {
        data.movieNodes.push({
          _key: `${asset.id}`,
          ...asset,
        });
      }

      return data;
    },
    { movieNodes: [], tvSeriesNodes: [], genreEdges: [] }
  );
};

importCredits = async (assets, assetType) => {
  let credits = [];
  const creditsPromises = [];
  const removeAssets = [];

  assets.forEach((asset) => {
    const getCreditsUrl = `/${assetType}/${asset.id}/credits?api_key=${tmdbApiKey}`;
    creditsPromises.push(instance.get(getCreditsUrl));
  });

  let response = await Promise.all(creditsPromises);
  response.forEach((res) => {
    credits = credits.concat(res.data);
  });

  let { creditNodes, creditEdges } = credits.reduce(
    (data, credit) => {
      if (!credit.cast.length || !credit.crew.length) {
        console.log(credit);
        removeAssets.push(credit.id);
      }

      credit.cast.forEach((cast) => {
        data.creditNodes.push({
          _key: `${cast.id}`,
          id: cast.id,
          name: cast.name,
          popularity: cast.popularity,
          known_for_department: cast.known_for_department,
        });

        data.creditEdges.push({
          _key: `assets-${credit.id}-credits-${cast.id}`,
          _from: `assets/${credit.id}`,
          _to: `credits/${cast.id}`,
          character: cast.character,
          type: "cast",
        });
      });

      credit.crew.forEach((crew) => {
        data.creditNodes.push({
          _key: `${crew.id}`,
          id: crew.id,
          name: crew.name,
          popularity: crew.popularity,
          known_for_department: crew.known_for_department,
        });

        data.creditEdges.push({
          _key: `assets-${credit.id}-credits-${crew.id}`,
          _from: `assets/${credit.id}`,
          _to: `credits/${crew.id}`,
          type: "crew",
          jod: crew.job,
          department: crew.department,
        });
      });
      return data;
    },
    { creditNodes: [], creditEdges: [] }
  );

  creditNodes = Array.from(new Set(creditNodes.map((credit) => credit.id))).map(
    (creditId) => {
      return creditNodes.find((credit) => credit.id === creditId);
    }
  );

  creditEdges = Array.from(
    new Set(creditEdges.map((creditEdge) => creditEdge._key))
  ).map((creditEdgeKey) => {
    return creditEdges.find((creditEdge) => creditEdge._key === creditEdgeKey);
  });

  // try {
  //   const insertedNodes = await jsc8Client.insertDocumentMany(
  //     "credits",
  //     creditNodes
  //   );
  //   const insertedEdges = await jsc8Client.insertDocumentMany(
  //     "asset_credit_edge",
  //     creditEdges
  //   );
  //   console.log(insertedNodes);
  //   console.log("\n\n");
  //   console.log(insertedEdges);
  // } catch (error) {
  //   console.log(error);
  // }
};

importMovies = async () => {
  let movies = [];
  const moviesPromises = [];

  genreList.forEach((genre) => {
    const discoverUrl = `/discover/movie?api_key=${tmdbApiKey}&with_genres=${genre.id}&primary_release_date.gte=2020-06-01&sort_by=popularity.desc&language=${LANG}`;
    moviesPromises.push(instance.get(`${discoverUrl}&page=1`));
    moviesPromises.push(instance.get(`${discoverUrl}&page=2`));
    moviesPromises.push(instance.get(`${discoverUrl}&page=3`));
    moviesPromises.push(instance.get(`${discoverUrl}&page=4`));
  });

  let response = await Promise.all(moviesPromises);
  response.forEach((res) => {
    movies = movies.concat(res.data.results);
  });

  let { movieNodes, genreEdges } = prepareNodesAndEdges(
    movies,
    ASSET_TYPES.MOVIE
  );

  movieNodes = Array.from(new Set(movieNodes.map((movie) => movie.id))).map(
    (movieId) => {
      return movieNodes.find((movie) => movie.id === movieId);
    }
  );

  genreEdges = Array.from(
    new Set(genreEdges.map((genreEdge) => genreEdge._key))
  ).map((genreEdgeKey) => {
    return genreEdges.find((genreEdge) => genreEdge._key === genreEdgeKey);
  });

  importCredits(movieNodes, ASSET_TYPES.MOVIE);
  // try {
  //   const insertedAssets = await jsc8Client.insertDocumentMany(
  //     "assets",
  //     movieNodes
  //   );
  //   const insertedEdges = await jsc8Client.insertDocumentMany(
  //     "genres_asset_edge",
  //     genreEdges
  //   );
  //   console.log(insertedAssets.length);
  //   console.log("\n\n");
  //   console.log(insertedEdges.length);
  // } catch (error) {
  //   console.log(error);
  // }
};

importTvShows = async () => {
  let tvSeries = [];
  const promises = [];

  genreList.forEach((genre) => {
    const discoverUrl = `/discover/tv?api_key=${tmdbApiKey}&with_genres=${genre.id}&primary_release_date.gte=2019-01-01&sort_by=popularity.desc&language=${LANG}`;
    promises.push(instance.get(`${discoverUrl}&page=1`));
    promises.push(instance.get(`${discoverUrl}&page=2`));
    promises.push(instance.get(`${discoverUrl}&page=3`));
  });

  let response = await Promise.all(promises);
  response.forEach((res) => {
    tvSeries = tvSeries.concat(res.data.results);
  });

  let { tvSeriesNodes, genreEdges } = prepareNodesAndEdges(
    tvSeries,
    ASSET_TYPES.TV
  );

  tvSeriesNodes = Array.from(
    new Set(tvSeriesNodes.map((series) => series.id))
  ).map((seriesId) => {
    return tvSeriesNodes.find((series) => series.id === seriesId);
  });

  genreEdges = Array.from(
    new Set(genreEdges.map((genreEdge) => genreEdge._key))
  ).map((genreEdgeKey) => {
    return genreEdges.find((genreEdge) => genreEdge._key === genreEdgeKey);
  });

  importCredits(tvSeriesNodes, ASSET_TYPES.TV);
  try {
    const insertedAssets = await jsc8Client.insertDocumentMany(
      "assets",
      tvSeriesNodes
    );
    const insertedEdges = await jsc8Client.insertDocumentMany(
      "genres_asset_edge",
      genreEdges
    );
    console.log(insertedAssets);
    console.log("\n\n");
    console.log(insertedEdges);
  } catch (error) {
    console.log(error);
  }
};

importMovies();
// importTvShows();
