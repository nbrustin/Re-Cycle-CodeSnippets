import React from "react";
import PropTypes from "prop-types";
import * as vendorService from "../../../services/vendorService";
import logger from "sabio-debug";

const _logger = logger.extend("vendor");

class VendorDetails extends React.Component {
  state = {
    id: "",
    name: "",
    description: "",
    headline: "",
    primaryImageId: 0,
    file: {
      url: ""
    }
  };

  componentDidMount() {
    if (this.props.location.state) {
      const vendorDetails = this.props.location.state.vendor;
      this.setState({
        id: vendorDetails.id,
        name: vendorDetails.name,
        description: vendorDetails.description,
        headline: vendorDetails.headline,
        primaryImageId: vendorDetails.primaryImageId,
        file: {
          url: vendorDetails.file.url
        }
      });
    } else {
      vendorService
        .getById(this.props.match.params.id)
        .then(this.onGetByIdSuccess)
        .catch(this.onActionError);
    }
  }

  onGetByIdSuccess = response => {
    this.setState({
      id: response.item.id,
      name: response.item.name,
      description: response.item.description,
      headline: response.item.headline,
      file: {
        url: response.item.file.url
      }
    });
  };

  onActionError = response => {
    _logger(response);
  };

  render() {
    return (
      <div className="unwrap">
        <div
          className="bg-cover"
          style={{
            backgroundImage:
              'url("https://images.fineartamerica.com/images-medium-large/row-of-bikes-gerth-jan-helmes.jpg")',
            height: "265px"
          }}
        >
          <div className="p-4 text-center text-white">
            <img
              className="img-thumbnail rounded-circle thumb128"
              src={this.state.file.url}
              alt="Avatar"
            />
            <h3 className="m-0">{this.state.name}</h3>
            <p>{this.state.headline}</p>
          </div>
        </div>
        <div className="text-center bg-green-dark p-3 mb-4">
          <div className="row">
            <div className="br col-4">
              <h3 className="m-0">173</h3>
              <p className="m-0">
                <span className="d-none d-md-inline">Bicycles Sold</span>
                <span />
              </p>
            </div>
            <div className="br col-4">
              <h3 className="m-0">675</h3>
              <p className="m-0">Followers</p>
            </div>
            <div className="col-4">
              <h3 className="m-0">322</h3>
              <p className="m-0">Following</p>
            </div>
          </div>
        </div>

        <div className="p-3">
          <div className="row">
            <div className="col-xl-9" />
            <div className="col-xl-12">
              <div className="card card-default">
                <div className="card-body">
                  <div className="text-center">
                    <h3 className="mt-0">{this.state.name}</h3>
                    <p>{this.state.headline}</p>
                  </div>
                  <hr />
                  <ul className="list-unstyled px-4">
                    <li>
                      <em className="fa fa-home fa-fw mr-3" />
                      Address
                    </li>
                    <li>
                      <em className="fa fa-briefcase fa-fw mr-3" />
                      <a>Themicon.co</a>
                    </li>
                    <li>
                      <em className="fa fa-graduation-cap fa-fw mr-3" />
                      Master Designer
                    </li>
                  </ul>
                </div>
              </div>
              <div className="card card-default">
                <div className="card-header">
                  <div className="text-center">
                    <a className="float-right">
                      <em className="icon-plus text-muted" />
                    </a>
                    <h3>Description</h3>
                  </div>
                </div>
                <div className="card-body">{this.state.description}</div>
              </div>
              <div className="card card-default">
                <div className="card-header">
                  <div className="text-center">
                    <a className="float-right">
                      <em className="icon-plus text-muted" />
                    </a>
                    <h3>Inventory</h3>
                  </div>
                </div>
                <div className="card-body" />
              </div>
              <div className="card card-default">
                <div className="card-header">
                  <div className="text-center">
                    <a className="float-right">
                      <em className="icon-plus text-muted" />
                    </a>
                    <h3>Products</h3>
                  </div>
                </div>
                <div className="card-body" />
              </div>
              <div className="card card-default">
                <div className="card-header">
                  <div className="text-center">
                    <a className="float-right">
                      <em className="icon-plus text-muted" />
                    </a>
                    <h3>Vendor Ratings</h3>
                  </div>
                </div>
                <div className="card-body" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

VendorDetails.propTypes = {
  location: PropTypes.shape({
    state: PropTypes.shape({
      description: PropTypes.string,
      vendor: PropTypes.object
    })
  }),
  match: PropTypes.shape({
    params: PropTypes.object
  }),
  history: PropTypes.shape({
    push: PropTypes.func
  }),
  currentUser: PropTypes.shape({
    id: PropTypes.number
  })
};

export default VendorDetails;
