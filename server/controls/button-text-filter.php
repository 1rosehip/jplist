<?php

	/**
	* get button text filter control query
	* @param {Object} $status
	* @return {Object}
	* status example
	* {
    *     "action": "filter",
    *     "name": "lifestyle-btn",
    *     "type": "button-text-filter",
    *     "data": {
    *         "path": ".title",
    *         "ignore": "[~!@#$%^&*()+=`'\"/\\_]+",
    *         "value": "",
    *         "selected": true
    *         "mode": "contains"
    *         "filterType": "TextFilter"
    *     },
    *     "cookies": true
    * }
	*/
	function buttontextfilter($status){

		$data = $status->data;
		$result = null;

		if($data->selected){

            $result = new FilterResultCollection('or');
            $fields = array('title', 'Description', 'Keyword1', 'Keyword2');

            switch($data->mode){

				case "startsWith":{

				    foreach ($fields as &$value) {

                        $model = new FilterResultModel();

                        $model->param = "%$data->value%"."%";
                        $model->query = " $value like ? ";
                        array_push($result->filterResults, $model);
                    }
					break;
				}

				case "endsWith":{

				    foreach ($fields as &$value) {

                        $model = new FilterResultModel();

                        $model->param = "%"."%$data->value%";
                        $model->query = " $value like ? ";
                        array_push($result->filterResults, $model);
                    }

					break;
				}

				default: {

                    foreach ($fields as &$value) {

                        $model = new FilterResultModel();

                        $model->param = "%$data->value%";
                        $model->query = " $value like ? ";
                        array_push($result->filterResults, $model);
                    }
				}
			}

		}

		return $result;
	}
?>