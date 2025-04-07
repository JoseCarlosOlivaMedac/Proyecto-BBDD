<template>
    <div class="search-bar-container">
      <div class="search-input-container">
        <svg xmlns="http://www.w3.org/2000/svg" class="search-icon" viewBox="0 0 24 24">
          <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round"/>
        </svg>
        <input
          type="text"
          v-model="searchQuery"
          @input="handleSearch"
          placeholder="Buscar productos..."
          class="search-input"
        />
        <button 
          v-if="searchQuery" 
          @click="clearSearch" 
          class="clear-button"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20">
            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" fill="currentColor"/>
          </svg>
        </button>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'SearchBar',
    emits: ['search'],
    data() {
      return {
        searchQuery: '',
        debounceTimeout: null
      }
    },
    methods: {
      handleSearch() {
        // Debounce the search to avoid too many emits
        clearTimeout(this.debounceTimeout)
        this.debounceTimeout = setTimeout(() => {
          this.$emit('search', this.searchQuery.toLowerCase())
        }, 300)
      },
      clearSearch() {
        this.searchQuery = ''
        this.$emit('search', '')
      }
    }
  }
  </script>
  
  <style scoped>
  .search-bar-container {
    max-width: 600px;
    margin: 0 auto 2rem;
    padding: 0 1rem;
  }
  
  .search-input-container {
    position: relative;
    display: flex;
    align-items: center;
  }
  
  .search-input {
    width: 100%;
    padding: 0.75rem 1rem 0.75rem 2.5rem;
    border: 2px solid #e0e0e0;
    border-radius: 30px;
    font-size: 1rem;
    transition: all 0.3s ease;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  }
  
  .search-input:focus {
    outline: none;
    border-color: #5c36f2;
    box-shadow: 0 2px 12px rgba(92, 54, 242, 0.2);
  }
  
  .search-icon {
    position: absolute;
    left: 1rem;
    width: 1.25rem;
    height: 1.25rem;
    color: #666;
  }
  
  .clear-button {
    position: absolute;
    right: 1rem;
    background: none;
    border: none;
    cursor: pointer;
    color: #666;
    transition: color 0.2s ease;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .clear-button:hover {
    color: #333;
  }
  
  @media (max-width: 768px) {
    .search-bar-container {
      margin-bottom: 1.5rem;
    }
    
    .search-input {
      padding: 0.6rem 1rem 0.6rem 2.2rem;
      font-size: 0.9rem;
    }
    
    .search-icon {
      width: 1rem;
      height: 1rem;
      left: 0.8rem;
    }
  }
  </style>