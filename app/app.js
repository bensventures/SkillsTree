import dataSource from '../data/all.json';

// Examples
import flatTree from './examples/flat-tree';
import radialTree from './examples/radial-tree';
import skills from './examples/skills';

document.addEventListener('DOMContentLoaded', () => {
    skills(dataSource.data);
});