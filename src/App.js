import React from "react";
import DataTable from "./components/DataTable";

function App() {
  return (
    <div className="App">
      <h1 style={{textAlign:'center',padding:'20px',marginBottom:'50px',color:'#008080',fontFamily:'cursive'}}>Customer Data</h1>
      <DataTable />
    </div>
  );
}

export default App;
