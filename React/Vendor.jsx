import React from "react";
import * as vendorService from "../../../services/vendorService";
import VendorCard from "./VendorCard";
import Pagination from "rc-pagination";
import "rc-pagination/assets/index.css";
import localeInfo from "rc-pagination/lib/locale/en_US";
import PropTypes from "prop-types";
import { Row } from "reactstrap";
import logger from "sabio-debug";
import swal from "sweetalert";

const _logger = logger.extend("vendor");

class Vendor extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      vendors: [],
      mappedVendors: [],
      current: 1,
      totalCount: 0,
      totalPages: 0,
      pageSize: 12
    };
  }

  componentDidMount() {
    this.getAllPaginate();
  }

  getAllPaginate = () => {
    vendorService
      .getPaginate(this.state.current - 1, this.state.pageSize)
      .then(this.getAllVendorsSuccess)
      .catch(this.onActionError);
  };

  onChange = page => {
    _logger(page);
    this.setState({ current: page }, () => this.getAllPaginate());
  };

  getAllVendorsSuccess = response => {
    let answer = response.item;
    this.setState({
      vendors: answer.pagedItems,
      mappedVendors: answer.pagedItems.map(this.mapVendors),
      totalCount: answer.totalCount,
      totalPages: answer.totalPages
    });
  };

  onDeactivate = id => {
    swal({
      title: "Deactivate Vendor?",
      icon: "warning",
      buttons: true,
      dangerMode: true
    }).then(willDelete => {
      if (willDelete) {
        swal("Vendor Deactivated", {
          icon: "success"
        });

        vendorService
          .deactivateVendor(id, 0)
          .then(this.onDeactivateSuccess)
          .catch(this.onActionError);
      } else {
        swal("Not Deactivated");
      }
    });
  };

  onDeactivateSuccess = id => {
    const newVendors = [...this.state.vendors];
    let index = newVendors.findIndex(item => item.id === id);
    if (index >= 0) {
      newVendors[index].isActive = false;
    }

    this.setState({
      vendors: newVendors,
      mappedVendors: newVendors.map(this.mapVendors)
    });
  };

  onReactivate = id => {
    swal({
      title: "Reactivate Vendor?",
      icon: "success",
      buttons: true
    }).then(willDelete => {
      if (willDelete) {
        swal("Vender Reactivated", {
          icon: "success"
        });
        vendorService
          .deactivateVendor(id, 1)
          .then(this.onReactivateSuccess)
          .catch(this.onActionError);
      } else {
        swal("Not Reactivated");
      }
    });
  };

  onReactivateSuccess = id => {
    const newVendors = [...this.state.vendors];
    let index = newVendors.findIndex(item => item.id === id);
    if (index >= 0) {
      newVendors[index].isActive = true;
    }

    this.setState({
      vendors: newVendors,
      mappedVendors: newVendors.map(this.mapVendors)
    });
  };

  onEdit = item => {
    this.props.history.push({
      pathname: "/admin/vendors/" + item.id + "/edit",
      state: { vendor: item }
    });
  };

  onVendorDetails = details => {
    this.props.history.push({
      pathname: "/admin/vendors/" + details.id + "/details",
      state: { vendor: details }
    });
  };

  mapVendors = aVendor => {
    return (
      <VendorCard
        item={aVendor}
        key={aVendor.id}
        deactivateVendor={this.onDeactivate}
        reactivateVendor={this.onReactivate}
        editVendor={this.onEdit}
        readVendor={this.onVendorDetails}
      />
    );
  };

  render() {
    return (
      <div className="container">
        <Row>{this.state.mappedVendors}</Row>
        <Row style={{ margin: "10px" }}>
          <div className="pagination">
            <Pagination
              onChange={this.onChange}
              current={this.state.current}
              pageSize={this.state.pageSize}
              total={this.state.totalCount}
              showQuickJumper
              showSizeChanger
              locale={localeInfo}
              showTotal={(total, range) =>
                `${range[0]} - ${range[1]} of ${total} items`
              }
            />
          </div>
        </Row>
      </div>
    );
  }
}

Vendor.propTypes = {
  history: PropTypes.object,
  match: PropTypes.object
};

export default Vendor;
