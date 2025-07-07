import React from 'react'
import Workspaceprovider from "./provider";
function WorkspaceLayout({ children}) {
  return (

       <Workspaceprovider>{children}</Workspaceprovider>
  )
}

export default WorkspaceLayout