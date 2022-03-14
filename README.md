# Business Network Spatial Service Samples
[![REUSE status](https://api.reuse.software/badge/github.com/SAP-samples/business-network-spatial-service-samples)](https://api.reuse.software/info/github.com/SAP-samples/business-network-spatial-service-samples)

## Description

The Network Spatial Service (NSS) features and functions are bundled within the SAP Business Network (SBN) and comes with 2 standard map renderer - SAP's Visual Business and [Mapbox](https://www.mapbox.com/). These renderers can be configured to display SAP and 3rd party geospatial maps, data and services. NSS leverages the micro-frontend framework provided by [SAP Luigi](https://luigi-project.io/) to render base maps and geospatial services from any provider, once an NSS renderer has been developed as per the instructions contained in this repository. NSS is an Industry4.NOW program initiative, part of SAP's Industry 4.0 strategy to enable the Intelligent Enterprise via  Industry Cloud applications. 
This repository provides the NSS Mapbox renderer's source code as sample code as well as a guide to create a custom map renderer with [NSC Client](https://www.npmjs.com/package/@sap/nsc-client). Information is also supplied in this repository on NSS APIs that allow geospatial data to be be replicated to the NSS HANA Spatial database so that it can be retrieved and enhanced within SBN applications such as the Asset Intelligence Network (AIN). 


## Requirements

This project uses `npm` and required [Node.js](https://nodejs.org/) to be installed.

Apart from that, this project also uses Live Server to run the app locally. Use this command to install:

```shell
> npm install -g live-server
```

## Download and Installation

A step-by-step guide on how to create this application from scratch can be found [here](./GUIDE.md).

Alternatively, you may clone this repo and use the below commands in the cloned directory to run the app locally.

```shell
# Install dependencies
> npm install

# Build the project
> npm run build

# Run the app
> npm start
```

## API Reference

More information on the NSC Client Map Renderer API can be found [here](./API.md).

## License
Copyright (c) 2022 SAP SE or an SAP affiliate company. All rights reserved. This project is licensed under the Apache Software License, version 2.0 except as noted otherwise in the [LICENSE](LICENSES/Apache-2.0.txt) file.
