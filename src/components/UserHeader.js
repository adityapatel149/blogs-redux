import React from "react";
import { connect } from "react-redux";
//import { fetchUser } from "../actions";

class UserHeader extends React.Component {
    /*
    componentDidMount() {
        this.props.fetchUser(this.props.userId);
    }
    already fetched users with fetchPostsAndUsers
    */
    render() {
        //const user = this.props.users.find(user => user.id === this.props.userId);
        //moved to maptstatetoprops to increase reusabiity of component.we can increase it if we write mapstatetoprops and connect setup in different file for big projects and reuse them with different components

        const { user } = this.props;

        if (!user) {
            return null;
        }
        return <div className="header">{user.name}</div>;
    }
}

const mapStateToProps = (state, ownProps) => {
    //this function has second argument. it is a reference to props passed to our component
    return {
        user: state.users.find(user => user.id === ownProps.userId)
    };
};
export default connect(mapStateToProps /*,{ fetchUser }*/)(UserHeader);
