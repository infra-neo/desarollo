# MCP Server Architecture Diagrams

## System Architecture

```mermaid
graph TB
    subgraph "Internet"
        User[End Users]
        Admin[Administrators]
    end

    subgraph "Edge Layer"
        Traefik[Traefik Reverse Proxy<br/>Port 80/443]
    end

    subgraph "Authentication Layer"
        Authentik[Authentik SSO<br/>OIDC Provider + MFA]
    end

    subgraph "Application Layer"
        JS[JumpServer<br/>Web Asset Management]
        WA[WebAsset Controller<br/>Credential Injection]
        Inf[Infisical<br/>Secrets Management]
        Panel[1Panel<br/>Admin Interface]
    end

    subgraph "Data Layer"
        PG[(PostgreSQL<br/>5 Databases)]
        Redis[(Redis<br/>Cache)]
    end

    subgraph "Security Layer"
        TS[Tailscale<br/>Zero Trust Network]
    end

    User -->|HTTPS| Traefik
    Admin -->|HTTPS| Traefik
    
    Traefik -->|ForwardAuth| Authentik
    Traefik --> JS
    Traefik --> WA
    Traefik --> Inf
    Traefik --> Panel
    
    JS --> PG
    JS --> Redis
    Inf --> PG
    Inf --> Redis
    WA --> PG
    WA --> Inf
    Panel --> PG
    Authentik --> PG
    Authentik --> Redis
    
    TS -.->|Secure Tunnel| JS
    TS -.->|Secure Tunnel| WA
    TS -.->|Secure Tunnel| Panel
```

## Network Flow Diagram

```mermaid
sequenceDiagram
    participant U as User
    participant T as Traefik
    participant A as Authentik
    participant W as WebAsset
    participant I as Infisical
    participant J as JumpServer
    participant B as Banking Site

    U->>T: Access web.domain.com
    T->>A: ForwardAuth Check
    
    alt Not Authenticated
        A-->>U: Redirect to Login
        U->>A: Login + MFA
        A-->>U: Session Token
    end
    
    U->>W: Access Site List
    W->>A: Validate Token
    A-->>W: User Info
    
    U->>W: Launch Banking Site
    W->>I: Get Credentials
    I-->>W: Master Username/Password
    
    W->>J: Create Session
    J-->>W: Session ID
    
    W->>B: Navigate + Auto-fill
    W-->>U: Display in Kiosk Mode
    
    Note over W,J: Session Recording Active
    
    U->>W: Work on Banking Site
    W->>J: Log Activity
    
    U->>W: Close Session
    W->>J: End Session
    J->>J: Save Recording
```

## Component Interaction Diagram

```mermaid
graph LR
    subgraph "User Journey"
        Login[User Login]
        MFA[MFA Challenge]
        Sites[Select Site]
        Access[Access Banking]
        Work[Perform Work]
        Logout[Close Session]
    end

    subgraph "Backend Processing"
        Auth[Authenticate]
        Fetch[Fetch Credentials]
        Launch[Launch Browser]
        Fill[Auto-fill Forms]
        Record[Record Session]
        Store[Store Audit]
    end

    Login --> Auth
    Auth --> MFA
    MFA --> Sites
    Sites --> Fetch
    Fetch --> Launch
    Launch --> Fill
    Fill --> Access
    Access --> Work
    Work --> Record
    Logout --> Store
```

## Deployment Architecture

```mermaid
graph TB
    subgraph "GCP Cloud"
        subgraph "VPC Network 10.0.0.0/24"
            subgraph "Compute Instance n1-standard-4"
                Docker[Docker Engine]
                
                subgraph "Docker Containers"
                    T[Traefik]
                    A[Authentik]
                    J[JumpServer Suite]
                    I[Infisical]
                    W[WebAsset]
                    P[1Panel]
                    DB[(PostgreSQL)]
                    R[(Redis)]
                    TS[Tailscale]
                end
            end
            
            LB[Cloud Load Balancer]
            NAT[Cloud NAT]
        end
        
        DNS[Cloud DNS]
        Storage[Persistent Disks]
    end
    
    Internet[Internet] --> LB
    LB --> T
    
    Docker --> Storage
    NAT --> Internet
    DNS --> LB
    
    T --> A
    T --> J
    T --> I
    T --> W
    T --> P
    
    J --> DB
    I --> DB
    W --> DB
    P --> DB
    A --> DB
    
    J --> R
    I --> R
    A --> R
```

## Data Flow Diagram

```mermaid
flowchart TD
    Start([User Initiates Session])
    
    Start --> Auth{Authenticated?}
    Auth -->|No| Login[SSO Login]
    Login --> MFA[MFA Challenge]
    MFA --> Auth
    
    Auth -->|Yes| SelectSite[Select Banking Site]
    SelectSite --> GetCreds[Fetch Credentials from Infisical]
    GetCreds --> CreateSession[Create JumpServer Session]
    CreateSession --> LaunchBrowser[Launch Browser with Playwright]
    LaunchBrowser --> Navigate[Navigate to Banking URL]
    Navigate --> AutoFill[Auto-fill Credentials]
    AutoFill --> Display[Display in Kiosk Mode]
    
    Display --> Working{Session Active?}
    Working -->|Yes| LogActivity[Log User Activity]
    LogActivity --> RecordVideo[Record Video]
    RecordVideo --> Working
    
    Working -->|No| CloseSession[Close Browser Session]
    CloseSession --> SaveRecording[Save Session Recording]
    SaveRecording --> UpdateAudit[Update Audit Log]
    UpdateAudit --> End([End Session])
```

## Security Architecture

```mermaid
graph TB
    subgraph "Security Layers"
        subgraph "Layer 1: Network Security"
            FW[GCP Firewall]
            TS[Tailscale Zero Trust]
        end
        
        subgraph "Layer 2: Transport Security"
            TLS[TLS 1.3 Encryption]
            Cert[Auto SSL Certificates]
        end
        
        subgraph "Layer 3: Authentication"
            SSO[SSO via Authentik]
            MFA[Mandatory MFA]
            OIDC[OIDC Protocol]
        end
        
        subgraph "Layer 4: Authorization"
            RBAC[Role-Based Access]
            Groups[User Groups]
            Policies[Asset Policies]
        end
        
        subgraph "Layer 5: Audit & Compliance"
            Logs[Activity Logs]
            Videos[Session Recordings]
            Reports[Audit Reports]
        end
        
        subgraph "Layer 6: Secrets Management"
            Vault[Infisical Vault]
            Encrypt[Encrypted Storage]
            Rotation[Key Rotation]
        end
    end
    
    FW --> TLS
    TS --> TLS
    TLS --> SSO
    Cert --> TLS
    SSO --> MFA
    MFA --> OIDC
    OIDC --> RBAC
    RBAC --> Groups
    Groups --> Policies
    Policies --> Logs
    Logs --> Videos
    Videos --> Reports
    Vault --> Encrypt
    Encrypt --> Rotation
```

## Database Schema Overview

```mermaid
erDiagram
    AUTHENTIK_DB ||--o{ USERS : contains
    AUTHENTIK_DB ||--o{ SESSIONS : contains
    AUTHENTIK_DB ||--o{ OIDC_PROVIDERS : contains
    
    JUMPSERVER_DB ||--o{ ASSETS : contains
    JUMPSERVER_DB ||--o{ USER_GROUPS : contains
    JUMPSERVER_DB ||--o{ SESSIONS : contains
    JUMPSERVER_DB ||--o{ PERMISSIONS : contains
    JUMPSERVER_DB ||--o{ RECORDINGS : contains
    
    INFISICAL_DB ||--o{ SECRETS : contains
    INFISICAL_DB ||--o{ PROJECTS : contains
    INFISICAL_DB ||--o{ SERVICE_TOKENS : contains
    
    WEBASSET_DB ||--o{ ACTIVE_SESSIONS : contains
    WEBASSET_DB ||--o{ AUDIT_LOGS : contains
    
    PANEL_DB ||--o{ CONTAINERS : contains
    PANEL_DB ||--o{ CONFIGS : contains
    
    USERS ||--o{ SESSIONS : creates
    USER_GROUPS ||--o{ USERS : contains
    USER_GROUPS ||--o{ PERMISSIONS : has
    PERMISSIONS ||--o{ ASSETS : grants_access_to
    SESSIONS ||--o{ RECORDINGS : generates
    SECRETS ||--o{ ASSETS : secures
```

---

## Diagram Descriptions

### System Architecture
Shows the high-level component structure with layers: Internet, Edge, Authentication, Application, Data, and Security.

### Network Flow Diagram
Illustrates the complete authentication and authorization flow from user login through MFA to accessing banking sites with credential injection.

### Component Interaction Diagram
Maps the user journey through the system and corresponding backend processes.

### Deployment Architecture
Shows the GCP infrastructure including VPC, compute instance, Docker containers, and cloud services.

### Data Flow Diagram
Details the step-by-step process of a user session from initiation to completion.

### Security Architecture
Depicts the six layers of security implemented in the system.

### Database Schema Overview
Entity relationship diagram showing the five PostgreSQL databases and their key entities.
