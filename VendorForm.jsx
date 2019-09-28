import React from "react";
import * as vendorService from "../../../services/vendorService";
import { Formik, FastField, Form } from "formik";
import logger from "sabio-debug";
import vendorValidationSchema from "./vendorValidation";
import PropTypes from "prop-types";
import "./vendorStyle.css";
import swal from "sweetalert";
import VendorCard from "./VendorCard";

const _logger = logger.extend("vendor");

class VendorForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      formData: {
        id: "",
        isActive: "",
        name: "",
        description: "",
        headline: "",
        primaryImageId: "",
        url: "",
        file: {
          url: ""
        }
      },
      buttonType: "Create",
      isEditing: false
    };
  }

  componentDidMount() {
    if (this.props.location.state && this.props.location.state.vendor) {
      const vendor = this.props.location.state.vendor;
      this.setState({
        formData: {
          id: vendor.id,
          isActive: vendor.isActive,
          name: vendor.name,
          description: vendor.description,
          headline: vendor.headline,
          primaryImageId: vendor.primaryImageId,
          url: vendor.file.url,
          file: {
            url: vendor.file.url
          }
        },
        buttonType: "Update",
        isEditing: true
      });
    } else {
      if (this.props.match.params.id)
        vendorService
          .getById(this.props.match.params.id)
          .then(this.onGetByIdSuccess)
          .catch(this.onActionError);
    }
  }

  onGetByIdSuccess = response => {
    this.setState({
      formData: {
        id: response.item.id,
        isActive: response.item.isActive,
        name: response.item.name,
        description: response.item.description,
        headline: response.item.headline,
        primaryImageId: response.item.primaryImageId,
        url: response.item.file.url,
        file: {
          url: response.item.file.url
        }
      },
      buttonType: "Update",
      isEditing: true
    });
  };

  onActionSuccess = response => {
    _logger(response);
    swal("Success", `Vendor Profile ${this.state.buttonType}d`, "success");
    this.props.history.goBack();
  };

  onActionError = response => {
    _logger(response);
  };

  handleSubmit = formValues => {
    this.setState({
      formData: {
        id: formValues.id,
        isActive: formValues.isActive,
        name: formValues.name,
        description: formValues.description,
        headline: formValues.headline,
        primaryImageId: formValues.primaryImageId,
        url: formValues.file.url,
        file: {
          url: formValues.file.url
        }
      }
    });

    if (this.state.isEditing) {
      vendorService
        .update(this.state.formData)
        .then(this.onActionSuccess)
        .catch(this.onActionError);
    } else {
      vendorService
        .add(this.state.formData)
        .then(this.onActionSuccess)
        .catch(this.onActionError);
    }
  };

  onVendorDetails = details => {
    this.props.history.push({
      pathname: "/admin/vendors/" + details.id + "/details",
      state: { vendor: details }
    });
  };

  render() {
    return (
      <div className="container">
        <div className="row">
          <div className="card-default formCard card col-md-6">
            <div className="card-body">
              <div className="form-group">
                <Formik
                  initialValues={this.state.formData}
                  onSubmit={this.handleSubmit}
                  validationSchema={vendorValidationSchema}
                  enableReinitialize={true}
                  render={formikProps => (
                    <Form>
                      <div>
                        <label className="col-form-label" htmlFor="name">
                          Vendor Name
                        </label>
                        <FastField
                          name="name"
                          placeholder="Enter Name"
                          component="input"
                          className="form-control"
                        />
                        {formikProps.touched.name &&
                          formikProps.errors.name && (
                            <div className="text-danger">
                              {formikProps.errors.name}
                            </div>
                          )}
                      </div>
                      <div>
                        <label className="col-form-label" htmlFor="headline">
                          Headline
                        </label>
                        <FastField
                          component="input"
                          name="headline"
                          className="form-control"
                        />
                        {formikProps.touched.headline &&
                          formikProps.errors.headline && (
                            <div className="text-danger">
                              {formikProps.errors.headline}
                            </div>
                          )}
                      </div>
                      <div>
                        <label className="col-form-label" htmlFor="description">
                          Description
                        </label>
                        <FastField
                          component="textarea"
                          name="description"
                          className="form-control"
                          rows="6"
                        />
                        {formikProps.touched.description &&
                          formikProps.errors.description && (
                            <div className="text-danger">
                              {formikProps.errors.description}
                            </div>
                          )}
                      </div>

                      <div>
                        <label className="col-form-label" htmlFor="url">
                          Image Url
                        </label>
                        <FastField
                          component="input"
                          name="url"
                          id="url"
                          className="form-control"
                        />
                      </div>

                      <div className="btn-group" role="group">
                        <button
                          type="submit"
                          className="btn form-button btn-primary btn-sm"
                        >
                          {this.state.buttonType}
                        </button>
                      </div>
                    </Form>
                  )}
                />
              </div>
            </div>
          </div>
          {this.state.formData.id ? (
            <VendorCard
              item={this.state.formData}
              readVendor={this.onVendorDetails}
              isEditing={this.state.isEditing}
            />
          ) : null}
        </div>
      </div>
    );
  }
}

VendorForm.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.object
  }),
  history: PropTypes.object,
  location: PropTypes.shape({
    state: PropTypes.shape({
      vendor: PropTypes.shape({})
    })
  })
};

export default VendorForm;
