from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Literal, Optional
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(
    title="Visual Infrastructure Builder API",
    description="API for deploying infrastructure to MicroCloud LXD via Libcloud",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic models
class Resource(BaseModel):
    type: Literal["vm", "container"]
    name: str
    cpu: int
    ram: str
    disk: Optional[str] = None
    network: str
    image: str
    firewall: List[str]
    user: str
    replicas: int

class DeploymentConfig(BaseModel):
    cluster: str
    resources: List[Resource]

class DeploymentResponse(BaseModel):
    status: str
    message: str
    deployed_resources: List[dict]

class PlanResponse(BaseModel):
    status: str
    plan: str
    summary: dict

# Helper functions
def parse_ram(ram_str: str) -> int:
    """Convert RAM string like '8GB' to MB"""
    ram_str = ram_str.upper().strip()
    if 'GB' in ram_str:
        return int(ram_str.replace('GB', '')) * 1024
    elif 'MB' in ram_str:
        return int(ram_str.replace('MB', ''))
    return 2048  # default 2GB

def parse_disk(disk_str: str) -> int:
    """Convert disk string like '50GB' to GB"""
    disk_str = disk_str.upper().strip()
    if 'GB' in disk_str:
        return int(disk_str.replace('GB', ''))
    elif 'TB' in disk_str:
        return int(disk_str.replace('TB', '')) * 1024
    return 20  # default 20GB

@app.get("/")
async def root():
    return {
        "message": "Visual Infrastructure Builder API",
        "version": "1.0.0",
        "endpoints": ["/deploy", "/plan"]
    }

@app.post("/plan", response_model=PlanResponse)
async def generate_plan(config: DeploymentConfig):
    """
    Generate a deployment plan showing what will be created
    """
    try:
        plan_lines = [
            f"Deployment Plan for Cluster: {config.cluster}",
            "=" * 60,
            ""
        ]
        
        total_vms = 0
        total_containers = 0
        total_instances = 0
        
        for resource in config.resources:
            ram_mb = parse_ram(resource.ram)
            plan_lines.append(f"Resource Type: {resource.type.upper()}")
            plan_lines.append(f"  Name: {resource.name}")
            plan_lines.append(f"  CPU Cores: {resource.cpu}")
            plan_lines.append(f"  RAM: {ram_mb}MB ({resource.ram})")
            
            if resource.disk:
                disk_gb = parse_disk(resource.disk)
                plan_lines.append(f"  Disk: {disk_gb}GB")
            
            plan_lines.append(f"  Network: {resource.network}")
            plan_lines.append(f"  Image: {resource.image}")
            plan_lines.append(f"  User: {resource.user}")
            plan_lines.append(f"  Firewall Rules: {', '.join(resource.firewall) if resource.firewall else 'None'}")
            plan_lines.append(f"  Replicas: {resource.replicas}")
            plan_lines.append("")
            
            if resource.type == "vm":
                total_vms += resource.replicas
            else:
                total_containers += resource.replicas
            
            total_instances += resource.replicas
        
        plan_lines.append("Summary:")
        plan_lines.append(f"  Total VMs: {total_vms}")
        plan_lines.append(f"  Total Containers: {total_containers}")
        plan_lines.append(f"  Total Instances: {total_instances}")
        
        return PlanResponse(
            status="success",
            plan="\n".join(plan_lines),
            summary={
                "cluster": config.cluster,
                "total_vms": total_vms,
                "total_containers": total_containers,
                "total_instances": total_instances,
                "resource_types": len(config.resources)
            }
        )
    except Exception as e:
        logger.error(f"Error generating plan: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to generate plan: {str(e)}")

@app.post("/deploy", response_model=DeploymentResponse)
async def deploy_infrastructure(config: DeploymentConfig):
    """
    Deploy infrastructure to MicroCloud LXD cluster using Libcloud
    
    NOTE: This is a demonstration implementation. In production, you would:
    1. Configure Libcloud driver for LXD
    2. Authenticate with the LXD cluster
    3. Actually create VMs and containers
    4. Configure networks and firewall rules
    """
    try:
        logger.info(f"Deploying to cluster: {config.cluster}")
        
        deployed = []
        
        # In a real implementation, you would use Libcloud here
        # Example pseudocode:
        # from libcloud.compute.types import Provider
        # from libcloud.compute.providers import get_driver
        # 
        # LXD = get_driver(Provider.LXD)
        # driver = LXD('https://your-lxd-endpoint:8443', 
        #              cert_file='/path/to/client.crt',
        #              key_file='/path/to/client.key')
        
        for resource in config.resources:
            for replica in range(resource.replicas):
                instance_name = f"{resource.name}-{replica + 1}" if resource.replicas > 1 else resource.name
                
                # Convert RAM and disk to proper units
                ram_mb = parse_ram(resource.ram)
                
                instance_config = {
                    "name": instance_name,
                    "type": resource.type,
                    "cpu": resource.cpu,
                    "ram_mb": ram_mb,
                    "network": resource.network,
                    "image": resource.image,
                    "user": resource.user,
                    "firewall": resource.firewall,
                    "status": "simulated_deployment"
                }
                
                if resource.disk and resource.type == "vm":
                    disk_gb = parse_disk(resource.disk)
                    instance_config["disk_gb"] = disk_gb
                
                # In production, you would create the actual instance here:
                # if resource.type == "vm":
                #     node = driver.create_node(
                #         name=instance_name,
                #         image=resource.image,
                #         size={'cpu': resource.cpu, 'ram': ram_mb, 'disk': disk_gb}
                #     )
                # else:
                #     # Create container
                #     pass
                
                deployed.append(instance_config)
                logger.info(f"Deployed {resource.type}: {instance_name}")
        
        return DeploymentResponse(
            status="success",
            message=f"Successfully deployed {len(deployed)} instances to {config.cluster}",
            deployed_resources=deployed
        )
        
    except Exception as e:
        logger.error(f"Deployment error: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Deployment failed: {str(e)}"
        )

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy", "service": "infrastructure-builder-api"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
