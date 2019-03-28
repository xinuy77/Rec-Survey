# Issues found during development
1. installing kurento-client gives error
	- problem: updated version of dependencies not compatible with current kurento-client
	- solved by downgrading node and dependencies required by kurento-client
2. only empty stream gets recorded by media server if stream is editted
	- problem: media profile spec type was not specified in recorder endpoint for editted stream with no audio
	- solved by specifing Media Profile Spec Type of Recorder Endpoint in parameter to WEBM_VIDEO_ONLY 
