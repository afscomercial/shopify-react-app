import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Accordion, Card, Button } from 'react-bootstrap';
import { shopifyService } from '../../services';
import { Spinner } from '../../components';
import { environments } from '../../config';

export const Home = ({ shop }) => {
  const [webhooks, setWebhooks] = useState(0);
  const [error, setError] = useState();
  const [loading, setLoading] = useState(true);
  const [successRegister, setSuccessRegister] = useState();
  const [webhooksUrl, setWebhooksUrl] = useState();
  const { lambda, allWebhooksAction, registerWebhooksAction } = environments;
  let component;

  useEffect(() => {
    (async () => {
      if (!successRegister) {
        const token = await localStorage.getItem(shop);
        const allWebhooksUrl = `${lambda}?code=${token}&shop=${shop}&action=${allWebhooksAction}`;
        try {
          const data = await shopifyService.getRequest(allWebhooksUrl);
          setLoading(false);
          setWebhooks(data.message);
        } catch (e) {
          setLoading(false);
          setError('Error registering webhooks');
        }
      }
    })();
  }, [lambda, allWebhooksAction, shop, successRegister]);

  useEffect(() => {
    if (successRegister) {
      setInterval(() => {
        setLoading(true);
        setSuccessRegister('');
      }, 3000);
    }
  }, [successRegister]);

  const formHandler = (event) => {
    event.preventDefault();
    setLoading(true);
    const token = localStorage.getItem(shop);
    const registerWebhooksUrl = `${lambda}?code=${token}&shop=${shop}&action=${registerWebhooksAction}&url=${webhooksUrl.trim()}`;
    shopifyService
      .getRequest(registerWebhooksUrl)
      .then((data) => {
        setLoading(false);
        setSuccessRegister(data.message);
      })
      .catch(() => {
        setLoading(false);
        setError('Error registering webhooks');
      });
  };

  if (webhooks.length > 0) {
    component = (
      <div className="card-body">
        <h4>Registered Webhooks  for {shop}</h4>
        <Accordion>
          {webhooks.map((webhook, idx) => {
            return (
              <Card key={webhook.id}>
                <Card.Header>
                  <Accordion.Toggle
                    as={Button}
                    variant="link"
                    eventKey={`${idx}`}
                  >
                    {webhook.topic}
                  </Accordion.Toggle>
                </Card.Header>
                <Accordion.Collapse eventKey={`${idx}`}>
                  <Card.Body>
                    <ul className="list-group list-group-flush">
                      <li className="list-group-item">
                        <strong>address:</strong> {webhook.address}
                      </li>
                      <li className="list-group-item">
                        <strong>created_at:</strong> {webhook.created_at}
                      </li>
                      <li className="list-group-item">
                        <strong>api_version:</strong> {webhook.api_version}
                      </li>
                    </ul>
                  </Card.Body>
                </Accordion.Collapse>
              </Card>
            );
          })}
        </Accordion>
      </div>
    );
  } else if (error) {
    component = <div className="card-body">{error}</div>;
  } else if (loading) {
    component = <Spinner />;
  } else if (successRegister) {
    component = (
      <div className="card-body">
        <div class="alert alert-primary" role="alert">
          {successRegister} successfully registered Webhooks
        </div>
      </div>
    );
  } else {
    component = (
      <>
        <div className="card-header">Webhooks Registration for {shop}</div>
        <div className="card-body">
          <form onSubmit={formHandler}>
            <div className="form-group">
              <input
                type="text"
                className="form-control"
                placeholder="mParticle Url"
                onChange={(e) => setWebhooksUrl(e.target.value)}
              />
            </div>
            <button type="submit" className="btn btn-primary">
              Register Webhooks
            </button>
          </form>
        </div>
      </>
    );
  }

  return component;
};

Home.propTypes = {
  shop: PropTypes.string,
};
