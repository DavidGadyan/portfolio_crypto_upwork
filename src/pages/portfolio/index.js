import React, { useEffect } from "react";
import "./style.css";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { Container, Row, Col } from "react-bootstrap";
import { dataportfolio, meta } from "../../content_option";
import { sendEvent } from "../../analytics"; // <-- GA import

export const Portfolio = () => {
  // GA: fire when Portfolio page is viewed
  useEffect(() => {
    sendEvent({
      action: "view_portfolio",
      category: "engagement",
      label: "Portfolio page",
    });
  }, []);

  // GA: fire when a specific portfolio project is clicked
  const handleProjectClick = (project) => {
    sendEvent({
      action: "click_portfolio_project",
      category: "portfolio",
      label: project.description || project.link,
    });
  };

  return (
    <HelmetProvider>
      <Container className="About-header">
        <Helmet>
          <meta charSet="utf-8" />
          <title>Portfolio | {meta.title}</title>
          <meta name="description" content={meta.description} />
        </Helmet>

        <Row className="mb-5 mt-3 pt-md-3">
          <Col lg="8">
            <h1 className="display-4 mb-4">Portfolio</h1>
            <hr className="t_border my-4 ml-0 text-left" />
          </Col>
        </Row>

        <div className="mb-5 po_items_ho">
          {dataportfolio.map((data, i) => {
            const isExternal = data.link.startsWith("http");

            return (
              <div key={i} className="po_item">
                <img
                  src={data.img}
                  alt={data.description || "portfolio item"}
                />
                <div className="content">
                  <p>{data.description}</p>
                  <a
                    href={data.link}
                    onClick={() => handleProjectClick(data)}
                    {...(isExternal
                      ? { target: "_blank", rel: "noreferrer" }
                      : {})}
                  >
                    view project
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </Container>
    </HelmetProvider>
  );
};
