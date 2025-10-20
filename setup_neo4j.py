#!/usr/bin/env python3
"""
Neo4j Setup Script for Hybrid Chat Application
This script helps you set up a local Neo4j database for the Vietnam Travel Assistant.
"""

import subprocess
import sys
import time
from neo4j import GraphDatabase

def check_docker():
    """Check if Docker is installed and running."""
    try:
        result = subprocess.run(['docker', '--version'], capture_output=True, text=True)
        if result.returncode == 0:
            print("✅ Docker is installed")
            return True
        else:
            print("❌ Docker is not installed")
            return False
    except FileNotFoundError:
        print("❌ Docker is not installed")
        return False

def start_neo4j_container():
    """Start Neo4j using Docker."""
    print("🚀 Starting Neo4j container...")
    try:
        # Stop any existing Neo4j container
        subprocess.run(['docker', 'stop', 'neo4j-hybrid-chat'], capture_output=True)
        subprocess.run(['docker', 'rm', 'neo4j-hybrid-chat'], capture_output=True)
        
        # Start new Neo4j container
        cmd = [
            'docker', 'run', '-d',
            '--name', 'neo4j-hybrid-chat',
            '-p', '7474:7474',  # HTTP
            '-p', '7687:7687',  # Bolt
            '-e', 'NEO4J_AUTH=neo4j/password',
            '-e', 'NEO4J_PLUGINS=["apoc"]',
            'neo4j:5.15'
        ]
        
        result = subprocess.run(cmd, capture_output=True, text=True)
        if result.returncode == 0:
            print("✅ Neo4j container started successfully")
            print("🌐 Neo4j Browser: http://localhost:7474")
            print("🔗 Bolt URI: bolt://localhost:7687")
            print("👤 Username: neo4j")
            print("🔑 Password: password")
            return True
        else:
            print(f"❌ Failed to start Neo4j container: {result.stderr}")
            return False
    except Exception as e:
        print(f"❌ Error starting Neo4j: {e}")
        return False

def wait_for_neo4j():
    """Wait for Neo4j to be ready."""
    print("⏳ Waiting for Neo4j to be ready...")
    max_attempts = 30
    for attempt in range(max_attempts):
        try:
            driver = GraphDatabase.driver("bolt://localhost:7687", auth=("neo4j", "password"))
            driver.verify_connectivity()
            driver.close()
            print("✅ Neo4j is ready!")
            return True
        except Exception:
            time.sleep(2)
            print(f"⏳ Attempt {attempt + 1}/{max_attempts}...")
    
    print("❌ Neo4j failed to start within timeout")
    return False

def create_sample_data():
    """Create sample Vietnam travel data."""
    print("📊 Creating sample data...")
    try:
        driver = GraphDatabase.driver("bolt://localhost:7687", auth=("neo4j", "password"))
        
        with driver.session() as session:
            # Create constraints
            session.run("CREATE CONSTRAINT entity_id IF NOT EXISTS FOR (e:Entity) REQUIRE e.id IS UNIQUE")
            
            # Create sample nodes
            sample_data = [
                ("Hanoi", "City", "Capital of Vietnam, known for its rich history and French colonial architecture"),
                ("Ho Chi Minh City", "City", "Largest city in Vietnam, formerly known as Saigon"),
                ("Ha Long Bay", "Attraction", "UNESCO World Heritage site with thousands of limestone karsts"),
                ("Hoi An", "City", "Ancient town with well-preserved architecture and lanterns"),
                ("Pho", "Food", "Traditional Vietnamese noodle soup"),
                ("Banh Mi", "Food", "Vietnamese sandwich with French baguette"),
                ("Vietnam Airlines", "Airline", "National flag carrier of Vietnam"),
                ("Vinpearl", "Resort", "Luxury resort chain in Vietnam")
            ]
            
            for name, entity_type, description in sample_data:
                session.run("""
                    MERGE (e:Entity {id: $id})
                    SET e.name = $name, e.type = $type, e.description = $description
                """, id=name.lower().replace(" ", "_"), name=name, type=entity_type, description=description)
            
            # Create relationships
            relationships = [
                ("hanoi", "LOCATED_IN", "vietnam"),
                ("ho_chi_minh_city", "LOCATED_IN", "vietnam"),
                ("ha_long_bay", "LOCATED_IN", "hanoi"),
                ("hoi_an", "LOCATED_IN", "vietnam"),
                ("pho", "POPULAR_IN", "hanoi"),
                ("banh_mi", "POPULAR_IN", "ho_chi_minh_city"),
                ("vietnam_airlines", "SERVES", "hanoi"),
                ("vietnam_airlines", "SERVES", "ho_chi_minh_city"),
                ("vinpearl", "HAS_RESORT_IN", "ha_long_bay")
            ]
            
            for from_id, rel_type, to_id in relationships:
                session.run("""
                    MATCH (from:Entity {id: $from_id})
                    MATCH (to:Entity {id: $to_id})
                    MERGE (from)-[r:RELATION {type: $rel_type}]->(to)
                """, from_id=from_id, to_id=to_id, rel_type=rel_type)
            
            print("✅ Sample data created successfully")
        
        driver.close()
        return True
        
    except Exception as e:
        print(f"❌ Error creating sample data: {e}")
        return False

def main():
    """Main setup function."""
    print("🇻🇳 Vietnam Travel Assistant - Neo4j Setup")
    print("=" * 50)
    
    # Check Docker
    if not check_docker():
        print("\n📋 To install Docker:")
        print("1. Visit: https://www.docker.com/products/docker-desktop/")
        print("2. Download and install Docker Desktop")
        print("3. Restart your computer")
        print("4. Run this script again")
        return False
    
    # Start Neo4j
    if not start_neo4j_container():
        return False
    
    # Wait for Neo4j to be ready
    if not wait_for_neo4j():
        return False
    
    # Create sample data
    if not create_sample_data():
        return False
    
    print("\n🎉 Setup complete!")
    print("\n📋 Next steps:")
    print("1. Your Neo4j database is running at bolt://localhost:7687")
    print("2. Access Neo4j Browser at http://localhost:7474")
    print("3. Username: neo4j, Password: password")
    print("4. Your config.py is already configured for local Neo4j")
    print("5. Restart your backend server to use the new database")
    
    return True

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)
