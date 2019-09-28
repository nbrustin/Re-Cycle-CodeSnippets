import React from "react";
import * as discountService from "../../services/discountService";
import { Formik, FastField, Form } from "formik";
import discountValidationSchema from "./discountValidation";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import "rc-tooltip/assets/bootstrap.css";
import "./discountStyle.css";
import PropTypes from "prop-types";
import logger from "sabio-debug";
import swal from "sweetalert";
const _logger = logger.extend("discount");

class DiscountForm extends React.Component {
  state = {
    formData: {
      productId: "",
      couponCode: "",
      title: "",
      description: "",
      percentage: 0,
      isRedeemedAllowed: true,
      validFrom: new Date(),
      validUntil: new Date()
    },
    buttonType: "Create"
  };

  componentDidMount() {
    if (this.props.match.params.id) {
      if (this.props.location.state) {
        const discount = this.props.location.state.discount;
        this.setState(prevState => {
          return {
            ...prevState,
            formData: {
              id: discount.id,
              productId: discount.productId,
              couponCode: discount.couponCode,
              title: discount.title,
              description: discount.description,
              percentage: discount.percentage,
              validFrom: new Date(discount.validFrom),
              validUntil: new Date(discount.validUntil),
              isRedeemedAllowed: discount.isRedeemedAllowed
            },
            buttonType: "Update"
          };
        });
      } else {
        discountService
          .getById(this.props.match.params.id)
          .then(this.onGetByIdSuccess)
          .catch(this.onActionError);
      }
    }
  }

  onGetByIdSuccess = response => {
    const answer = response.item;
    this.setState(prevState => {
      return {
        ...prevState,
        formData: {
          productId: answer.productId,
          couponCode: answer.couponCode,
          title: answer.title,
          description: answer.description,
          percentage: answer.percentage,
          validFrom: new Date(answer.validFrom),
          validUntil: new Date(answer.validUntil),
          isRedeemedAllowed: answer.isRedeemedAllowed
        },
        buttonType: "Update"
      };
    });
  };

  onActionSuccess = response => {
    _logger(response);
    swal("Success", `Coupon Code ${this.state.buttonType}d`, "success");
    this.props.history.push("/discounts");
  };

  onActionError = response => {
    _logger(response);
  };

  handleChangeStart = (validFrom, values) => {
    this.setState(prevState => {
      return { ...prevState, formData: { ...values, validFrom } };
    });
  };

  handleChangeEnd = (validUntil, values) => {
    this.setState(prevState => {
      return { ...prevState, formData: { ...values, validUntil } };
    });
  };

  handleSubmit = formValues => {
    if (formValues.id) {
      discountService
        .update(formValues)
        .then(this.onActionSuccess)
        .catch(this.onActionError);
    } else {
      discountService
        .add(formValues)
        .then(this.onActionSuccess)
        .catch(this.onActionError);
    }
  };

  onSliderChange = (percentage, values) => {
    this.setState(prevState => {
      return { ...prevState, formData: { ...values, percentage } };
    });
  };

  render() {
    return (
      <div className="content-wrapper">
        <div className="container-md container">
          <div className="card-default card">
            <div className="card-body">
              <Formik
                initialValues={this.state.formData}
                onSubmit={this.handleSubmit}
                validationSchema={discountValidationSchema}
                enableReinitialize={true}
                render={formikProps => (
                  <React.Fragment>
                    <Form className="form-horizontal" method="get" action="/">
                      <h2>Coupon Code</h2>
                      <fieldset>
                        <div className="position-relative row form-group">
                          <label className="col-md-2 col-form-label">
                            Product Id
                          </label>
                          <div className="col-md-10">
                            <FastField
                              name="productId"
                              placeholder="e.g. 13"
                              component="input"
                              type="text"
                              className="form-control"
                            />
                            {formikProps.touched.productId &&
                              formikProps.errors.productId && (
                                <div className="text-danger">
                                  {formikProps.errors.productId}
                                </div>
                              )}
                          </div>
                        </div>
                      </fieldset>
                      <fieldset>
                        <div className="position-relative row form-group">
                          <label className="col-md-2 col-form-label">
                            Coupon Code
                          </label>
                          <div className="col-md-10">
                            <FastField
                              name="couponCode"
                              placeholder="e.g. Bike2020"
                              component="input"
                              type="text"
                              className="form-control"
                            />
                            {formikProps.touched.couponCode &&
                              formikProps.errors.couponCode && (
                                <div className="text-danger">
                                  {formikProps.errors.couponCode}
                                </div>
                              )}
                          </div>
                        </div>
                      </fieldset>
                      <fieldset>
                        <div className="position-relative row form-group">
                          <label className="col-md-2 col-form-label">
                            Title
                          </label>
                          <div className="col-md-10">
                            <FastField
                              name="title"
                              placeholder="e.g. Coupon Code"
                              component="input"
                              type="text"
                              className="form-control"
                            />
                            {formikProps.touched.title &&
                              formikProps.errors.title && (
                                <div className="text-danger">
                                  {formikProps.errors.title}
                                </div>
                              )}
                          </div>
                        </div>
                      </fieldset>
                      <fieldset>
                        <div className="position-relative row form-group">
                          <label className="col-md-2 col-form-label">
                            Description
                          </label>
                          <div className="col-md-10" rows="3">
                            <FastField
                              name="description"
                              placeholder="e.g. This coupon code applies to all bikes"
                              type="text"
                              component="input"
                              className="form-control"
                            />
                            {formikProps.touched.description &&
                              formikProps.errors.description && (
                                <div className="text-danger">
                                  {formikProps.errors.description}
                                </div>
                              )}
                          </div>
                        </div>
                      </fieldset>
                      <fieldset>
                        <div className="position-relative row form-group">
                          <label className="col-md-2 col-form-label">
                            Discount
                          </label>

                          <div className="col-md-10">
                            <div style={{ width: "30rem" }}>
                              <p>{this.state.formData.percentage}%</p>

                              <Slider
                                name="percentage"
                                component="input"
                                value={this.state.formData.percentage}
                                min={0}
                                max={100}
                                onChange={val =>
                                  this.onSliderChange(val, formikProps.values)
                                }
                              />
                              {formikProps.touched.percentage &&
                                formikProps.errors.percentage && (
                                  <div className="text-danger">
                                    {formikProps.errors.percentage}
                                  </div>
                                )}
                            </div>
                          </div>
                        </div>
                      </fieldset>
                      <fieldset>
                        <div className="position-relative row form-group">
                          <label className="col-md-2 col-form-label">
                            Valid From
                          </label>
                          <div className="col-md-10">
                            <DatePicker
                              name="validFrom"
                              component="input"
                              selected={this.state.formData.validFrom}
                              selectsStart
                              validFrom={this.state.formData.validFrom}
                              validUntil={this.state.formData.validUntil}
                              onChange={val =>
                                this.handleChangeStart(val, formikProps.values)
                              }
                              minDate={new Date()}
                              showTimeSelect
                              timeIntervals={15}
                              dateFormat="MMMM d, yyyy hh:mm aa"
                              timeCaption="time"
                            />
                            {formikProps.touched.validFrom &&
                              formikProps.errors.validFrom && (
                                <div className="text-danger">
                                  {formikProps.errors.validFrom}
                                </div>
                              )}
                          </div>
                        </div>
                        <div className="position-relative row form-group">
                          <label className="col-md-2 col-form-label">
                            Valid Until
                          </label>
                          <div className="col-md-10">
                            <DatePicker
                              name="validUntil"
                              component="input"
                              selected={this.state.formData.validUntil}
                              selectsEnd
                              validFrom={this.state.formData.validFrom}
                              validUntil={this.state.formData.validUntil}
                              onChange={val =>
                                this.handleChangeEnd(val, formikProps.values)
                              }
                              minDate={this.state.formData.validFrom}
                              showTimeSelect
                              timeIntervals={15}
                              dateFormat="MMMM d, yyyy h:mm aa"
                              timeCaption="time"
                            />
                          </div>
                        </div>
                      </fieldset>
                      <div className="btn-group" role="group">
                        <button
                          type="submit"
                          className="btn btn-default form-button"
                        >
                          {this.state.buttonType}
                        </button>
                      </div>
                    </Form>
                  </React.Fragment>
                )}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

DiscountForm.propTypes = {
  location: PropTypes.shape({
    state: PropTypes.shape({
      discount: PropTypes.shape({})
    })
  }),
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string
    })
  }),
  history: PropTypes.object
};
export default DiscountForm;
