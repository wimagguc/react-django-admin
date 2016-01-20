var RDA = RDA || {};
RDA.Views = RDA.Views || {};

RDA.Views.HelloView = React.createClass({
  	render: function() {
		return (
            <div>
				<RDA.Views.NavigationTop/>
				<h3>Hello</h3>
			</div>
		);
	}
});

RDA.Views.renderHelloView = function() {
	React.render(
		<RDA.Views.HelloView/>,
		document.getElementById('app')
	);
}
