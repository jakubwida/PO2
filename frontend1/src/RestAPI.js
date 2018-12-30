export default class RestAPI {
	static put(url,data_obj){
		return fetch(url, {
			method: "PUT",
			headers: {
				"Content-Type": "application/json",
			},
			redirect: "follow",
			referrer: "no-referrer",
			body: JSON.stringify(data_obj),
		}).then(response => response.json());
	}

	static post(url,data_obj){
		return fetch(url, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			redirect: "follow",
			referrer: "no-referrer",
			body: JSON.stringify(data_obj),
		}).then(response => response.json());
	}

	static postFile(base_url,file){
		return this.post(base_url+"/file",file)
	}

	static putAddNode(base_url,node_id,precursor_id){
		return this.put(base_url+"/addnode",{node_id:String(node_id),precursor_id:String(precursor_id)})
	}

	static putAddLink(base_url,node1_id,node2_id){
		return this.put(base_url+"/addlink",{node1_id:String(node1_id),node2_id:String(node2_id)})
	}

	static putRemoveNode(base_url,node_id){
		return this.put(base_url+"/removenode",{node_id:String(node_id)})
	}

	static putRemoveLink(base_url,node1_id,node2_id){
		return this.put(base_url+"/removelink",{node1_id:String(node1_id),node2_id:String(node2_id)})
	}

	static putSwapNodes(base_url,node1_id,node2_id){
		return this.put(base_url+"/swapnodes",{node1_id:String(node1_id),node2_id:String(node2_id)})
	}

}
