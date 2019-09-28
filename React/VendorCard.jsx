import React from "react";
import PropTypes from "prop-types";
import "./vendorStyle.css";

const VendorCard = props => {
  const onDeactivateButtonHandler = () => {
    if (props.item.isActive) {
      props.deactivateVendor(props.item.id);
    } else {
      props.reactivateVendor(props.item.id);
    }
  };
  const onEditButtonHandler = () => {
    props.editVendor(props.item);
  };
  const onReadMoreHandler = () => {
    props.readVendor(props.item);
  };
  const defaultImage = e => {
    e.target.src = "./img/home/Re-Cycle-Static-Image-300px-W.jpg";
  };
  return (
    <div className="col-md-3">
      <div className="card card-landing mb-6">
        <img
          className={`${
            props.item.isActive ? "vendorImg" : "vendorImg isDisabled"
          }`}
          src={props.item.file.url}
          onError={defaultImage}
          alt="vendor logo"
        />
        <div className="card-body">
          <p className="d-flex">{props.item.name}</p>
          <h4>{props.item.headline}</h4>
        </div>
        <div className="buttons">
          <span
            className={`${
              props.item.isActive ? "btn btn-link readMore" : "isDisabled"
            }`}
            onClick={onReadMoreHandler}
          >
            Go to Vendor Page
          </span>
          <span className="float-right">
            <i
              className={`${!props.isEditing &&
                (props.item.isActive
                  ? "fa-fw fa-md fa fa-edit mr-2"
                  : "isDisabled")}`}
              onClick={onEditButtonHandler}
            />
            <i
              className={`${!props.isEditing &&
                (props.item.isActive
                  ? "fa-fw fa-md fas fa-trash-alt mr-2"
                  : "fa-fw fa-sm fas fa-check mr-2")}`}
              onClick={onDeactivateButtonHandler}
            />
          </span>
        </div>
      </div>
    </div>
  );
};

VendorCard.propTypes = {
  item: PropTypes.shape({
    id: PropTypes.number,
    name: PropTypes.string,
    description: PropTypes.string,
    headline: PropTypes.string,
    primaryImageId: PropTypes.number,
    isActive: PropTypes.bool,
    file: PropTypes.shape({
      url: PropTypes.string
    })
  }),
  isEditing: PropTypes.bool,
  deactivateVendor: PropTypes.func,
  editVendor: PropTypes.func,
  readVendor: PropTypes.func,
  reactivateVendor: PropTypes.func
};

export default VendorCard;
