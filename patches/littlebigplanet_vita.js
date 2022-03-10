//to be applied over base_littlebigplanet - this is the base argument

return base
	.replace(/GAME_NAME/g, "LittleBigPlanet Vita")
	.replace(/GAME_URLS/g, `{
			http: new BinaryUrl("http://lbpvita.online.scee.com:10060/LITTLEBIGPLANETPS3_XML"),
			https: new BinaryUrl("https://lbpvita.online.scee.com:10061/LITTLEBIGPLANETPS3_XML"),
			beta_http: new BinaryUrl("http://lbpvita-beta.online.scee.com:10060/LITTLEBIGPLANETPS3_XML"),
			beta_https: new BinaryUrl("https://lbpvita-beta.online.scee.com:10061/LITTLEBIGPLANETPS3_XML"),
		}`);