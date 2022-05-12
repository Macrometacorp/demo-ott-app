# OTT App :popcorn:

[:link: Here](https://i4z6k5n4.stackpathcdn.com) is the link for the live demo!

## Edge Database Resources

### :small_blue_diamond: Collections

In Cox Edge Portal, go to **Edge Database/COLLECTIONS** section and create the following collections:

```
assets_ott (global)
genres (global)
credits (global)
asset_ott_credit_edge (graph-edge, global)
genres_asset_ott_edge (graph-edge, local)
```

### :small_blue_diamond: Search

Create the following search views in **Edge Database/SEARCH** section:

**`asset_ott_credit_view`** with Primary sort field `popularity desc` and Mapping Definition:
| **Collection** | **Field** | **Analyzer** |
| ------------------------ | --------- | ------------- |
| `assets_ott` | title | text_en |
| `assets_ott` | original_title | text_en |
| `assets_ott` | overview | text_en |
| `assets_ott` | name | text_en |
| `credits` | name | text_en |

And, **`asset_ott_type_view`** search view with Mapping Definition:
| **Collection** | **Field** | **Analyzer** |
| ------------------------ | --------- | ------------- |
| `genres_asset_ott_edge` | asset_type | identity |

### :small_blue_diamond: Graphs

In **Edge Database/GRAPHS** section, create the `OTT` graph with the properties:

| **Edge Definitions**    | **From Collections** | **To Collections** |
| ----------------------- | -------------------- | ------------------ |
| `genres_asset_ott_edge` | genres               | assets             |
| `asset_ott_credit_edge` | assets               | credits            |

### :small_blue_diamond: Query Workers

In **Edge Database/QUERIES** section, create the following list of query workers:

```
getMovieAssetsByGenre
getTopRatedMovies
getTopRatedTvSeries
getTvSeriesAssetsByGenre
searchByAsset
searchByCredits
```

Refer to this [:link: link ](./edge-database/query-workers.md) to get the content for each query worker.

## Run It Locally

On your development machine, run the following commands in a terminal console:

```
git clone git@github.com:CoxEdge-Tools/demos.git

cd demos/ott-app/react-app

npm install

npm start
```

:pencil: You can run `npm run build` command to generate your `build` directory.

:small_red_triangle: Don't forget to setup your environment variables in `.env.development.local` or `.env.production.local`.
