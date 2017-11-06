import React, { Component } from 'react';
import {CopyToClipboard} from 'react-copy-to-clipboard';

import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import Drawer from 'material-ui/Drawer';
import List, { ListItem, ListItemIcon, ListItemText } from 'material-ui/List';
import CopyIcon from 'material-ui-icons/ContentCopy';
import { CardHeader } from 'material-ui/Card';

let lib = require("../utils/library.js");

class HistoryPane extends Component {
	constructor(props) {
		super(props);
		// historyArray will have the latest URL at the end ... i.e. 0 position is the earliest query, and the highest position index is the latest query...
		// TODO: Need to make historyArray db specific!!!
		this.state = {
			historyPaneVisibility: this.props.historyPaneVisibility || false,
			newHistoryItem: this.props.newHistoryItem,
			historyArray: []
		};
	}

	componentWillReceiveProps(newProps) {
		this.setState({
			historyPaneVisibility: newProps.historyPaneVisibility
		});

		console.log("Got URL as : " + newProps.newHistoryItem[0], " and rules as : " + JSON.stringify(newProps.newHistoryItem[1]));
		// If the incoming newHistoryItem isn't already the current state.newHistoryItem AND it actually exists THEN
		if (this.state.newHistoryItem !== newProps.newHistoryItem && 
			newProps.newHistoryItem !== [] && 
			newProps.newHistoryItem !== undefined && 
			newProps.newHistoryItem !== null && 
			newProps.newHistoryItem) {
			// Check if the new item already exists in the historyArray
			if (lib.inArray(newProps.newHistoryItem, this.state.historyArray) === false) { // doesn't exist, so insert it at highestIndex+1 position (i.e. 0th index is oldest)
				var arrayvar = this.state.historyArray.slice();
				arrayvar.push(newProps.newHistoryItem);

				this.setState({
					historyPaneVisibility: newProps.historyPaneVisibility,
					newHistoryItem: newProps.newHistoryItem,
					historyArray: arrayvar
				});
			} else { // already exists, move it to "top" (which in this case is the highest index...)
				this.setState({
					historyPaneVisibility: newProps.historyPaneVisibility,
					newHistoryItem: newProps.newHistoryItem,
					historyArray: lib.moveArrayElementFromTo(this.state.historyArray, lib.elementPositionInArray(newProps.newHistoryItem, this.state.historyArray), this.state.historyArray.length - 1)
				});
			}
		} else {
			// just make sure the (potentially) new visibility setting is saved...
			this.setState({
				historyPaneVisibility: newProps.historyPaneVisibility
			});
		}
		console.log("Current historyArray = " + JSON.stringify(this.state.historyArray));
	}

	closeDrawer() {
		this.props.closeHistoryPane();
		this.setState({
			historyPaneVisibility: false,
		});
	};

	render() {
		const classes = this.props.classes;
		const sideList = (
			<div className={classes.list}>
				<CardHeader subheader="Query History" />
				<List dense>
					{
						this.state.historyArray.slice(0).reverse().map((item) => {
							let index = lib.elementPositionInArray(item, this.state.historyArray);
							return (
									<ListItem button key={index}>
										<ListItemIcon className={classes.noStyleButton}>
											<CopyIcon/>
										</ListItemIcon>
										<ListItemText primary={item[0].replace(lib.getDbConfig(this.props.dbIndex, "url"), "").replace(/\?.*/, "").replace("/", "")} secondary={item[0].replace(lib.getDbConfig(this.props.dbIndex, "url"), "").replace(/.*\?/, "").replace(/&/g, "\n").replace(/,/g, ",\n")} />
									</ListItem>
								);
						})
					}
				</List>
			</div>
		);

		return (
			<Drawer anchor="right" open={this.state.historyPaneVisibility} onRequestClose={this.closeDrawer.bind(this)}>
				<div tabIndex={0} role="button">
					{sideList}
				</div>
			</Drawer>
		);
	}
}

HistoryPane.propTypes = {
	classes: PropTypes.object.isRequired,
};

const styleSheet = {
	root: {
		width: '30%',
		height: '100%',
		float: 'right'
	},
	list: {
		width: 400,
	},
	listFull: {
		width: 'auto',
	},
	noStyleButton: {
		border: "none",
		backgroundColor: "transparent"
	}
};

export default withStyles(styleSheet)(HistoryPane);