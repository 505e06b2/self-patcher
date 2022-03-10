//to be applied over base_littlebigplanet - this is the base argument

return base
	.replace(/GAME_NAME/g, "LittleBigPlanet PSP")
	.replace(/GAME_URLS/g, `{
			http: new BinaryUrl("http://%s:10060/LITTLEBIGPLANETPSP_XML%s"),
			https: new BinaryUrl("https://%s:10061/LITTLEBIGPLANETPSP_XML%s")
		}`);