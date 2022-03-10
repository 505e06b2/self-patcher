//to be applied over base_littlebigplanet - this is the base argument

return base
	.replace(/GAME_NAME/g, "LittleBigPlanet 2")
	.replace(/GAME_URLS/g, `{
			http: new BinaryUrl("http://littlebigplanetps3.online.scee.com:10060/LITTLEBIGPLANETPS3_XML"),
			https: new BinaryUrl("https://littlebigplanetps3.online.scee.com:10061/LITTLEBIGPLANETPS3_XML")
		}`);