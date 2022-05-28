import React, { Component } from 'react';

class Emailform extends Component {

  sendEmail(ev) {
      ev.preventDefault();
  }

  componentDidMount() {
  }
  
  render() {
    return(
    <div>
      <div className="py-5 text-center">
        <h2>Send Email</h2>
      </div>

      <div className="row">
        <div className="col-md-12 order-md-1">
          <h4 className="mb-3">Email</h4>
          <form onSubmit={this.sendEmail.bind(this)} className="needs-validation" noValidate>
            <div className="row">
              <div className="col-md-12 mb-3">
                <label htmlFor="desc">To</label>
                <input type="text" className="form-control" id="to" defaultValue="" required />
                <div className="invalid-feedback">
                    A description is required.
                </div>
              </div>
            </div>
            <button className="btn btn-primary btn-lg btn-block" type="submit">Send email</button>
          </form>
        </div>
      </div>

      <footer className="my-5 pt-5 text-muted text-center text-small">
        <p className="mb-1">&copy; 2020 CPSC 2650</p>
      </footer>
    </div>
    );
  }
}

export default Emailform;
