# Spark UI Builder - Workspace Feature Documentation

## Overview

The Spark UI Builder is a drag-and-drop infrastructure orchestration tool that enables visual design and configuration of hybrid cloud infrastructure. It provides an intuitive interface for creating, configuring, and managing cloud resources without writing complex scripts.

## Accessing the Workspace

1. Navigate to the application
2. Log in with your credentials (or register a new account)
3. Click on "Workspace" in the sidebar navigation

## Features

### 1. Drag-and-Drop Canvas

The main workspace uses React Flow to provide an interactive canvas where you can:
- Drag infrastructure blocks from the sidebar
- Position them freely on the canvas
- Create connections between blocks by dragging from one block's handle to another
- Zoom and pan the canvas using mouse controls
- Use the minimap for navigation

### 2. Infrastructure Blocks

The following block types are available:

#### Cloud Provider
- **Purpose**: Represents a cloud provider configuration
- **Configurable Fields**:
  - Name
  - Description
  - Provider (GCP, AWS, Azure, Oracle, etc.)
  - Region

#### Hypervisor
- **Purpose**: Represents virtualization platform
- **Configurable Fields**:
  - Name
  - Description
- **Examples**: LXD, VMware, KVM, MicroCloud

#### Virtual Machine (VM)
- **Purpose**: Represents a virtual machine instance
- **Configurable Fields**:
  - Name
  - Description
  - CPU Cores
  - RAM (GB)
  - Disk (GB)
  - Operating System
  - IP Address
  - Gateway

#### Container
- **Purpose**: Represents a containerized application
- **Configurable Fields**:
  - Name
  - Description

#### Application
- **Purpose**: Represents an application or service
- **Configurable Fields**:
  - Name
  - Description

#### User
- **Purpose**: Represents a user account
- **Configurable Fields**:
  - Name
  - Description
  - Username
  - Email
  - Assigned Role

#### Role
- **Purpose**: Represents an access control role
- **Configurable Fields**:
  - Name
  - Description

#### Network
- **Purpose**: Represents network configuration
- **Configurable Fields**:
  - Name
  - Description
  - Subnet
  - VLAN

#### Firewall
- **Purpose**: Represents firewall rules
- **Configurable Fields**:
  - Name
  - Description
  - Port(s)
  - Protocol (TCP/UDP)
  - Source
  - Destination

### 3. Configuration Panel

When you click on a block, a configuration panel appears on the right side:
- Edit all configurable properties
- Save changes
- Delete the block

### 4. Toolbar Actions

The toolbar at the top provides several actions:

#### Import
- Load a previously exported infrastructure blueprint
- Supports JSON format
- Restores all blocks and connections

#### Export
- Save your current workspace as a JSON blueprint
- Can be version controlled
- Can be shared with team members
- Format is human-readable and editable

#### Validate
- Checks the workspace configuration for errors
- Validates relationships between blocks
- Examples of validation rules:
  - Apps must be connected to VMs
  - VMs should be connected to networks

#### Deploy
- Placeholder for deployment functionality
- Would trigger API calls to provision infrastructure
- Integrations planned: Apache Libcloud, Terraform, LXD API, Ansible

#### Clear
- Removes all blocks from the workspace
- Confirmation dialog prevents accidental clearing

### 5. Block Relationships

Blocks can be connected to show relationships:
- **Cloud → Network**: Network belongs to cloud provider
- **Network → VM**: VM connects to network
- **VM → App**: App runs on VM
- **Network → Firewall**: Firewall protects network
- **User → Role**: User assigned to role

### 6. Sample Blueprint

A sample blueprint is included at `/public/mock-blueprint.json` demonstrating:
- GCP cloud provider configuration
- Production network setup
- Web server VM with specifications
- Nginx web application
- Firewall rules for HTTP/HTTPS
- Admin user configuration

To load this sample:
1. Click "Import" in the toolbar
2. Navigate to `public/mock-blueprint.json`
3. The workspace will populate with the sample infrastructure

## Technical Architecture

### State Management
- **Zustand** store for global workspace state
- Manages nodes, edges, and selected node
- Provides validation logic
- Handles export/import functionality

### Components

#### WorkspaceCanvas
- Main canvas using React Flow
- Handles drag-and-drop from sidebar
- Manages node positioning and connections
- Includes minimap and controls

#### BlocksSidebar
- Lists all available infrastructure blocks
- Implements drag start events
- Shows usage instructions

#### ConfigurationPanel
- Dynamic form based on block type
- Handles property updates
- Provides delete functionality

#### WorkspaceToolbar
- Action buttons for workspace operations
- Shows workspace statistics
- Handles import/export/validate/deploy

#### CustomNode
- Visual representation of infrastructure blocks
- Color-coded by type
- Shows name and description
- Connection handles

### Validation Rules

The validation system checks:
1. Apps must be connected to VMs
2. VMs should be connected to networks
3. More rules can be added as needed

### Export Format

```json
{
  "version": "1.0",
  "timestamp": "2025-10-29T07:00:00.000Z",
  "nodes": [
    {
      "id": "vm-1",
      "type": "custom",
      "position": { "x": 100, "y": 350 },
      "data": {
        "label": "Virtual Machine",
        "type": "vm",
        "config": {
          "name": "web-server-01",
          "cpu": 4,
          "ram": 16,
          "disk": 100,
          "os": "Ubuntu 22.04 LTS"
        }
      }
    }
  ],
  "edges": [
    {
      "source": "network-1",
      "target": "vm-1",
      "type": "default"
    }
  ]
}
```

## Future Enhancements

### Planned Features
1. **Authentication Integration**
   - OIDC (Authentik)
   - Keycloak support

2. **Deployment Backends**
   - Apache Libcloud integration
   - Terraform provider
   - LXD REST API
   - Ansible playbook generation

3. **Remote Access**
   - TSPlus integration
   - Guacamole for HTML5 sessions
   - RDP/SSH connections

4. **Network Tunneling**
   - OpenZiti integration
   - Headscale for private tunnels

5. **Monitoring**
   - Mist.io verification
   - Real-time status updates
   - Metrics and logs
   - Alerting

6. **Templates**
   - Save workspace as template
   - Share templates with team
   - Template marketplace

7. **Collaboration**
   - Real-time multi-user editing
   - Comments and annotations
   - Change history

8. **Advanced Features**
   - Clone blocks
   - Group blocks
   - Auto-layout
   - Search and filter
   - Undo/redo

## Usage Tips

1. **Start Simple**: Begin with a few blocks to understand the workflow
2. **Use Validation**: Always validate before deploying
3. **Save Often**: Export your work regularly
4. **Naming**: Use clear, descriptive names for blocks
5. **Organization**: Group related blocks together visually
6. **Connections**: Use connections to document dependencies
7. **Sample Blueprint**: Load the sample to see a complete example

## Troubleshooting

### Blocks won't connect
- Ensure both blocks have visible connection handles
- Try zooming in for better precision

### Configuration not saving
- Click "Save Changes" button after editing
- Check browser console for errors

### Import fails
- Verify JSON format is valid
- Check file has both "nodes" and "edges" arrays

### Canvas is empty
- Try clicking "Import" and loading the sample blueprint
- Use mouse wheel to zoom out
- Check if blocks are positioned off-screen

## Keyboard Shortcuts

- **Mouse Wheel**: Zoom in/out
- **Click + Drag**: Pan canvas
- **Delete**: Remove selected node (when configuration panel is open)
- **Esc**: Close configuration panel

## Browser Compatibility

- Chrome/Edge: Fully supported
- Firefox: Fully supported
- Safari: Fully supported
- Mobile: Limited support (desktop recommended)

## Performance Notes

- Recommended max nodes: 100 blocks
- Large workspaces may affect performance
- Use minimap for navigation in large workspaces
- Export regularly to avoid data loss

## Support and Feedback

For issues or feature requests, please contact the development team or open an issue in the repository.
