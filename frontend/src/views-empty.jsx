var EmptyView = React.createClass({
  	render: function() {
		return (
			<div></div>
		);
	}
});

function renderEmptyView() {
	React.render(
		<EmptyView/>,
		document.getElementById('app')
	);
}
