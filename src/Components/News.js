import React, { useState, useEffect } from "react";
import NewsItem from "./NewsItem";
import Spinner from "./Spinner";
import PropTypes from "prop-types";
import InfiniteScroll from "react-infinite-scroll-component";

const News = (props) => {
  const [articles, setarticles] = useState([]);
  const [loading, setloading] = useState(true);
  const [page, setpage] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  // document.title = `${this.CapitalizeFirstLetter(
  //   props.category
  // )}-NewsApp`;
  const CapitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };
  const updateItem = async () => {
    props.setProgress(10);
    const url = `https://newsapi.org/v2/top-headlines?country=${props.country}&category=${props.category}&apiKey=1f1046a2f12742e59b53a67b4f516e4a&page=${props.page}&pageSize=${props.pageSize}`;
    setloading(true);

    let data = await fetch(url);
    props.setProgress(30);

    let parsedData = await data.json();
    props.setProgress(70);
    setarticles(parsedData.articles);
    setTotalResults(parsedData.totalResults);
    setloading(false);

    props.setProgress(100);
  };
  useEffect(() => {
    updateItem();
  }, []);

  const fetchMoreData = async () => {
    setpage(page + 1);
    const url = `https://newsapi.org/v2/top-headlines?country=${props.country}&category=${props.category}&apiKey=1f1046a2f12742e59b53a67b4f516e4a&page=${props.page}&pageSize=${props.pageSize}`;
    let data = await fetch(url);
    let parsedData = await data.json();
    setarticles(articles.concat(parsedData.articles));
    setTotalResults(parsedData.totalResults);
  };
  // const handlePrevClick = async () => {
  //   setpage(page - 1);
  //   updateItem();
  // };
  // const handleNextClick = async () => {
  //   setpage(page + 1);
  //   updateItem();
  // };
  return (
    <>
      <h1 className="text-center">
        {CapitalizeFirstLetter(props.category)} News-Top Headlines
      </h1>
      {/* {this.state.loading && <Spinner />} */}
      {/* {!this.state.loading && */}
      <InfiniteScroll
        dataLength={articles.length}
        next={fetchMoreData}
        hasMore={articles.length !== totalResults}
        loader={<Spinner />}
      >
        <div className="container">
          <div className="row">
            {articles?.map((element) => {
              return (
                <div className="col-md-4 my-3" key={element.url}>
                  <NewsItem
                    title={element.title ? element.title.slice(0, 35) : ""}
                    source={element.source.name}
                    description={
                      element.description
                        ? element.description.slice(0, 88)
                        : ""
                    }
                    imageUrl={element.urlToImage}
                    newsUrl={element.url}
                    author={element.author}
                    date={element.publishedAt}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </InfiniteScroll>

      {/* <div className="container d-flex justify-content-between">
        //   <button
        //     disabled={state.page <= 1}
        //     type="button"
        //     className="btn btn-dark"
        //     onClick={handlePrevClick}
        //   >
        //     &larr; Previous
        //   </button>
        //   <button
        //     disabled={
        //       page + 1 >
        //       Math.ceil(totalResults / props.pageSize)
        //     }
        //     type="button"
        //     className="btn btn-dark"
        //     onClick={handleNextClick}
        //   >
        //     Next &rarr;
        //   </button>
        </div> */}
    </>
  );
};

News.defaultProps = {
  country: "in",
  pageSize: 6,
  category: "general",
};
News.propTypes = {
  country: PropTypes.string,
  pageSize: PropTypes.number,
  category: PropTypes.string,
};
export default News;
