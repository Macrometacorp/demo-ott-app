<h1 align="center">Macrometa OTT App</h1>

### **Live Demo:** https://macrometacorp.github.io/demo-ott-app/

## Setup

| **Federation**                     | **Fabric** | **Email**         |
| ---------------------------------- | ---------- | ----------------- |
| [Play](https://play.macrometa.io/) | ott_app    | demo@macrometa.io |

## Overview

**Architecture:**

![architecture.png](architecture.png)

**Dashboard:**

![landing-page.png](landing-page.png)

### Macrometa GDN setup

1. Create the following collections in your federation:

```
assets (global)
genres (global)
credits (global)
my_list (global)
users (global)
asset_credit_edge (graph-edge, global)
genres_asset_edge (graph-edge, local)
```

2. Create the following search views in your federation:

**`asset_credit_view`** with Primary sort field `popularity`
| **Mapping - Collection** | **Field** | **Analyzer** |
| ------------------------ | --------- | ------------- |
| assets | title | text_en |
| assets | original_title | text_en |
| assets | overview | text_en |
| credits | name | text_en |

**`asset_type_view`**
| **Mapping - Collection** | **Field** | **Analyzer** |
| ------------------------ | --------- | ------------- |
| genres_asset_edge | asset_type | identity |

3. Create the following graph in your federation:

**`OTT`**
| **Edge Definitions** | **From Collections** | **To Collections** |
| ------------------------ | --------- | ------------- |
| genres_asset_edge | genres | assets |
| asset_credit_edge | assets | credits |

4. Create the following Query workers in your federation:

```
getMovieAssetsByGenre
getTopRatedMovies
getTopRatedTvSeries
getTvSeriesAssetsByGenre
searchByAsset
searchByCredits
```

Refer to this link to add content for each [Query worker](query-worker/query-worker.md).

5. On the development machine, run the commands below in a console. Use Node.js v16.

```
1. git clone https://github.com/Macrometacorp/demo-ott-app.git
2. cd demo-ott-app/react-app
3. git fetch
4. npm install
5. npm run start
```
