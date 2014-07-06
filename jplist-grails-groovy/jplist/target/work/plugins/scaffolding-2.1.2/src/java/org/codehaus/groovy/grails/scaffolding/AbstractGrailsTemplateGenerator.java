/*
 * Copyright 2013 SpringSource.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
package org.codehaus.groovy.grails.scaffolding;

import grails.build.logging.GrailsConsole;
import groovy.text.SimpleTemplateEngine;
import groovy.text.Template;

import java.io.BufferedWriter;
import java.io.File;
import java.io.FileWriter;
import java.io.IOException;
import java.io.InputStream;
import java.io.Writer;
import java.util.Collections;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Map;
import java.util.Set;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.codehaus.groovy.grails.commons.GrailsApplication;
import org.codehaus.groovy.grails.commons.GrailsDomainClass;
import org.codehaus.groovy.grails.commons.GrailsDomainClassProperty;
import org.codehaus.groovy.grails.plugins.GrailsPluginInfo;
import org.codehaus.groovy.grails.plugins.GrailsPluginManager;
import org.codehaus.groovy.grails.plugins.GrailsPluginUtils;
import org.codehaus.groovy.grails.plugins.PluginManagerAware;
import org.codehaus.groovy.runtime.IOGroovyMethods;
import org.codehaus.groovy.runtime.StringGroovyMethods;
import org.springframework.context.ResourceLoaderAware;
import org.springframework.core.io.AbstractResource;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.core.io.ResourceLoader;
import org.springframework.core.io.support.PathMatchingResourcePatternResolver;
import org.springframework.util.Assert;
import org.springframework.util.StringUtils;

public abstract class AbstractGrailsTemplateGenerator implements GrailsTemplateGenerator, ResourceLoaderAware, PluginManagerAware {

	protected static final Log log = LogFactory.getLog(AbstractGrailsTemplateGenerator.class);

	protected String basedir = ".";
	protected boolean overwrite = false;
	protected SimpleTemplateEngine engine = new SimpleTemplateEngine();
	protected ResourceLoader resourceLoader;
	protected Template renderEditorTemplate;
	protected String domainSuffix = "";
	protected GrailsPluginManager pluginManager;
	protected GrailsApplication grailsApplication;

	protected enum GrailsControllerType {
		DEFAULT,
		RESTFUL,
		ASYNC
	}

	protected AbstractGrailsTemplateGenerator(ClassLoader classLoader) {
		engine = new SimpleTemplateEngine(classLoader);
	}

	public void generateViews(GrailsDomainClass domainClass, String destDir) throws IOException {
		Assert.hasText(destDir, "Argument [destdir] not specified");

		File viewsDir = new File(destDir, "grails-app/views/" + domainClass.getPropertyName());
		if (!viewsDir.exists()) {
			viewsDir.mkdirs();
		}

		for (String name : getTemplateNames()) {
			if (log.isInfoEnabled()) {
				log.info("Generating [" + name + "] view for domain class [" + domainClass.getFullName() + "]");
			}
			generateView(domainClass, name, viewsDir.getAbsolutePath());
		}
	}

	public void generateController(GrailsControllerType controllerType, GrailsDomainClass domainClass, String destDir) throws IOException {
		Assert.hasText(destDir, "Argument [destdir] not specified");

		if (domainClass == null) {
			return;
		}

		String fullName = domainClass.getFullName();
		String pkg = "";
		int pos = fullName.lastIndexOf('.');
		if (pos != -1) {
			// Package name with trailing '.'
			pkg = fullName.substring(0, pos + 1);
		}

		File destFile = new File(destDir, "grails-app/controllers/" + pkg.replace('.', '/') +
				domainClass.getShortName() + "Controller.groovy");
		if (canWrite(destFile)) {
			destFile.getParentFile().mkdirs();

			BufferedWriter writer = null;
			try {
				writer = new BufferedWriter(new FileWriter(destFile));
				generateController(controllerType, domainClass, writer);
				try {
					writer.flush();
				} catch (IOException ignored) {}
			}
			finally {
				IOGroovyMethods.closeQuietly(writer);
			}

			log.info("Controller generated at [" + destFile + "]");
		}
	}

	@Override
	public void generateController(GrailsDomainClass domainClass, String destDir) throws IOException {
		generateController(GrailsControllerType.DEFAULT, domainClass, destDir);
	}

	@Override
	public void generateRestfulController(GrailsDomainClass domainClass, String destDir) throws IOException {
		generateController(GrailsControllerType.RESTFUL, domainClass, destDir);
	}

	@Override
	public void generateAsyncController(GrailsDomainClass domainClass, String destDir) throws IOException {
		generateController(GrailsControllerType.ASYNC, domainClass, destDir);
	}

	public void generateView(GrailsDomainClass domainClass, String viewName, Writer out) throws IOException {
		String templateText = getTemplateText(viewName + ".gsp");

		if (!StringUtils.hasLength(templateText)) {
			return;
		}

		GrailsDomainClassProperty multiPart = null;
		for (GrailsDomainClassProperty property : domainClass.getProperties()) {
			if (property.getType() == Byte[].class || property.getType() == byte[].class) {
				multiPart = property;
				break;
			}
		}

		String packageName = StringUtils.hasLength(domainClass.getPackageName()) ? "<%@ page import=\"" + domainClass.getFullName() + "\" %>" : "";
		Map<String, Object> binding = createBinding(domainClass);
		binding.put("packageName", packageName);
		binding.put("multiPart", multiPart);
		binding.put("propertyName", getPropertyName(domainClass));

		generate(templateText, binding, out);
	}

	protected abstract Object getRenderEditor();

	@Override
	public void generateView(GrailsDomainClass domainClass, String viewName, String destDir) throws IOException {
		File destFile = new File(destDir, viewName + ".gsp");
		if (!canWrite(destFile)) {
			return;
		}

		BufferedWriter writer = null;
		try {
			writer = new BufferedWriter(new FileWriter(destFile));
			generateView(domainClass, viewName, writer);
			try {
				writer.flush();
			}
			catch (IOException ignored) {}
		}
		finally {
			IOGroovyMethods.closeQuietly(writer);
		}
	}

	@Override
	public void generateController(GrailsDomainClass domainClass, Writer out) throws IOException {
		generateController(GrailsControllerType.DEFAULT, domainClass, out);
	}

	protected void generateController(GrailsControllerType controllerType, GrailsDomainClass domainClass, Writer out) throws IOException {
		String templateText = null;
		switch (controllerType) {
		case DEFAULT:
			templateText = getTemplateText("Controller.groovy");
			break;
		case RESTFUL:
			templateText = getTemplateText("RestfulController.groovy");
			break;
		case ASYNC:
			templateText = getTemplateText("AsyncController.groovy");
			break;
		}

		Map<String, Object> binding = createBinding(domainClass);
		binding.put("packageName", domainClass.getPackageName());
		binding.put("propertyName", getPropertyName(domainClass));

		generate(templateText, binding, out);
	}

	@Override
	public void generateRestfulTest(GrailsDomainClass domainClass, String destDir) throws IOException {
		generateTest(domainClass, destDir, "RestfulSpec.groovy");
	}

	@Override
	public void generateAsyncTest(GrailsDomainClass domainClass, String destDir) throws IOException {
		generateTest(domainClass, destDir, "AsyncSpec.groovy");
	}

	@Override
	public void generateTest(GrailsDomainClass domainClass, String destDir) throws IOException {
		generateTest(domainClass, destDir, "Spec.groovy");
	}

	private void generateTest(GrailsDomainClass domainClass, String destDir, String templateName) throws IOException {
		File destFile = new File(destDir, domainClass.getPackageName().replace('.', '/') + '/' + domainClass.getShortName() + "ControllerSpec.groovy");
		if (!canWrite(destFile)) {
			return;
		}

		String templateText = getTemplateText(templateName);

		Map<String, Object> binding = createBinding(domainClass);
		binding.put("packageName", domainClass.getPackageName());
		binding.put("propertyName", domainClass.getLogicalPropertyName());
		binding.put("modelName", getPropertyName(domainClass));

		destFile.getParentFile().mkdirs();
		BufferedWriter writer = null;
		try {
			writer = new BufferedWriter(new FileWriter(destFile));
			generate(templateText, binding, writer);
			try {
				writer.flush();
			}
			catch (IOException ignored) {}
		}
		finally {
			IOGroovyMethods.closeQuietly(writer);
		}
	}

	@SuppressWarnings("deprecation")
	protected Map<String, Object> createBinding(GrailsDomainClass domainClass) {
		boolean hasHibernate = pluginManager.hasGrailsPlugin("hibernate") || pluginManager.hasGrailsPlugin("hibernate4");

		Map<String, Object> binding = new HashMap<String, Object>();
		binding.put("pluginManager", pluginManager);
		binding.put("domainClass", domainClass);
		binding.put("className", domainClass.getShortName());
		binding.put("renderEditor", getRenderEditor());
		binding.put("comparator", hasHibernate ? DomainClassPropertyComparator.class : SimpleDomainClassPropertyComparator.class);
		return binding;
	}

	protected void generate(String templateText, Map<String, Object> binding, Writer out) {
		try {
			engine.createTemplate(templateText).make(binding).writeTo(out);
		}
		catch (ClassNotFoundException e) {
			throw new RuntimeException(e);
		}
		catch (IOException e) {
			throw new RuntimeException(e);
		}
	}

	protected String getPropertyName(GrailsDomainClass domainClass) {
		return domainClass.getPropertyName() + domainSuffix;
	}

	protected String getTemplateText(String template) throws IOException {
		InputStream inputStream = null;
		if (resourceLoader != null && grailsApplication.isWarDeployed()) {
			inputStream = resourceLoader.getResource("/WEB-INF/templates/scaffolding/" + template).getInputStream();
		}
		else {
			AbstractResource templateFile = getTemplateResource(template);
			if (templateFile.exists()) {
				inputStream = templateFile.getInputStream();
			}
		}

		return inputStream == null ? null : IOGroovyMethods.getText(inputStream);
	}

	protected AbstractResource getTemplateResource(String template) throws IOException {
		String name = "src/templates/scaffolding/" + template;
		AbstractResource templateFile = new FileSystemResource(new File(basedir, name).getAbsoluteFile());
		if (!templateFile.exists()) {
			templateFile = new FileSystemResource(new File(getPluginDir(), name).getAbsoluteFile());
		}

		return templateFile;
	}

	protected File getPluginDir() throws IOException {
		GrailsPluginInfo info = GrailsPluginUtils.getPluginBuildSettings().getPluginInfoForName("scaffolding");
		return info.getDescriptor().getFile().getParentFile();
	}

	protected boolean canWrite(File testFile) {
		if (overwrite || !testFile.exists()) {
			return true;
		}

		try {
			String relative = makeRelativeIfPossible(testFile.getAbsolutePath(), basedir);
			String response = GrailsConsole.getInstance().userInput(
					"File " + relative + " already exists. Overwrite?", new String[] { "y", "n", "a" });
			overwrite = overwrite || "a".equals(response);
			return overwrite || "y".equals(response);
		}
		catch (Exception e) {
			// failure to read from standard in means we're probably running from an automation tool like a build server
			return true;
		}
	}

	protected String makeRelativeIfPossible(String fileName, String base) throws IOException {
		if (StringUtils.hasLength(base)) {
			fileName = StringGroovyMethods.minus(fileName, new File(base).getCanonicalPath());
		}
		return fileName;
	}

	protected Set<String> getTemplateNames() throws IOException {

		if (resourceLoader != null && grailsApplication.isWarDeployed()) {
			try {
				PathMatchingResourcePatternResolver resolver = new PathMatchingResourcePatternResolver(resourceLoader);
				return extractNames(resolver.getResources("/WEB-INF/templates/scaffolding/*.gsp"));
			}
			catch (Exception e) {
				return Collections.emptySet();
			}
		}

		PathMatchingResourcePatternResolver resolver = new PathMatchingResourcePatternResolver();
		Set<String> resources = new HashSet<String>();

		String templatesDirPath = basedir + "/src/templates/scaffolding";
		Resource templatesDir = new FileSystemResource(templatesDirPath);
		if (templatesDir.exists()) {
			try {
				resources.addAll(extractNames(resolver.getResources("file:" + templatesDirPath + "/*.gsp")));
			}
			catch (Exception e) {
				log.error("Error while loading views from " + basedir, e);
			}
		}

		File pluginDir = getPluginDir();
		try {
			resources.addAll(extractNames(resolver.getResources("file:" + pluginDir + "/src/templates/scaffolding/*.gsp")));
		}
		catch (Exception e) {
			// ignore
			log.error("Error locating templates from " + pluginDir + ": " + e.getMessage(), e);
		}

		return resources;
	}

	protected Set<String> extractNames(Resource[] resources) {
		Set<String> names = new HashSet<String>();
		for (Resource resource : resources) {
			String name = resource.getFilename();
			names.add(name.substring(0, name.length() - 4));
		}
		return names;
	}

	public void setGrailsApplication(GrailsApplication ga) {
		grailsApplication = ga;
		Object suffix = ga.getFlatConfig().get("grails.scaffolding.templates.domainSuffix");
		if (suffix instanceof CharSequence) {
			domainSuffix = suffix.toString();
		}
	}

	public void setResourceLoader(ResourceLoader rl) {
		if (log.isInfoEnabled()) {
			log.info("Scaffolding template generator set to use resource loader [" + rl + "]");
		}
		resourceLoader = rl;
	}

	public void setPluginManager(GrailsPluginManager gpm) {
		pluginManager = gpm;
	}

	public void setOverwrite(boolean shouldOverwrite) {
		overwrite = shouldOverwrite;
	}
}
